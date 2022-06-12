var width = window.innerWidth;
var height = window.innerHeight;
var a = 0;
class ViewMarker{
    constructor(ctn){
        var that = this;
        this.stage = new Konva.Stage({
            container: ctn,
            width: width * 2 / 3,
            height: height * 0.8
        });
        this.layer1 = new Konva.Layer({
            draggable: true,
        });
        this.scaleBy = 1.02;

        this.background;
        Konva.Image.fromURL("/my_image.png", function(background){
            that.background = background;
            var w = width*2/3;
            var wa = that.background.width();
            that.background.width(w);
            that.background.scaleY(w/wa);

            that.layer1.add(that.background);
            that.stage.add(that.layer1);
            that.onReady();
        });
        this._initInteractive();

        this.markers = [];
        this.onReady = function(){};
        this.imgMarker = new Image();
        this.imgMarker.src = "/maker.png"
        this.imgMarker.onload = this.onReady;
        this.infoMarker = new Konva.Group();
        this._initMarker();
    }
    _initMarker(){
        var that = this;
        var complexText = new Konva.Text({
            text: "Đà Nẵng",
            fontSize: 18,
            fontFamily: 'Calibri',
            fill: '#555',
            padding: 10,
            align: 'center',
            name: "nameMarker"
        });
        var rect = new Konva.Rect({
            stroke: '#555',
            strokeWidth: 2,
            fill: '#ddd',
            width: complexText.width(),
            height: complexText.height(),
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowOpacity: 0.2,
            cornerRadius: 10,
            name: "rect"
        });
        that.infoMarker.add(rect);
        that.infoMarker.add(complexText);

        that.infoMarker.showMarker = function (marker){
            // Neu co truyen thong so - khong thi lay thong so cu
            if(marker){
                that.infoMarker.marker = marker;
            }            
            var texts = that.infoMarker.find('.nameMarker');
            texts[0].text(that.infoMarker.marker.data.name);

            var rects = that.infoMarker.find('.rect');
            rects[0].width(texts[0].width());
            rects[0].height(texts[0].height());

            that.infoMarker.adjustIndex();
            that.infoMarker.show();
            that.infoMarker.zIndex(1);
        }

        that.infoMarker.adjustIndex = function(){
            if(!that.infoMarker.marker){
                return;
            }
            var rects = that.infoMarker.find('.rect');
            that.infoMarker.x(that.infoMarker.marker.x() - (rects[0].width() + 5)/that.layer1.scaleX());
            that.infoMarker.y(that.infoMarker.marker.y() - (rects[0].height() + 5)/that.layer1.scaleX());
        }

        // Cai dat vao
        that.layer1.add(that.infoMarker);
        that.infoMarker.hide();

        // MVVC
        that.app = {};
    }
    _initInteractive(){
        var that = this;
        that.layer1.on('click', function(e){
            console.log(e);
            a = e;
        });
        this.stage.on('wheel', function(e){
            e.evt.preventDefault();
            var oldScale = that.layer1.scaleX();
            var pointer = that.stage.getPointerPosition();
            var mousePointTo = {
                x: (pointer.x - that.stage.x()) / oldScale,
                y: (pointer.y - that.stage.y()) / oldScale,
            };

            let direction = e.evt.deltaY > 0 ? 1 : -1;
            if (e.evt.ctrlKey) {
                direction = - direction;
            } else {
                return;
            }
      
            var newScale = direction > 0 ? oldScale * that.scaleBy : oldScale / that.scaleBy;
            if(newScale < 1){
                newScale = 1;
            }
            that.layer1.scale({ x: newScale, y: newScale });
        
            // Cac thong so khong thay doi khi scale
            // Kich thuoc marker
            that.markers.forEach(function(marker){
                marker.scale({
                    x: 1/newScale,
                    y: 1/newScale
                })
            })
            // Kich thuoc info marker
            that.infoMarker.scale({
                x: 1/newScale,
                y: 1/newScale
            });

            // Khoang cach info marker
            that.infoMarker.adjustIndex();
            
            var newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            that.stage.position(newPos);
        });

    }
    reloadMarker(markers){
        var that = this;
        // Xoa va ve lai marker
        this.markers.forEach(function(marker){
            marker.destroy();
        });
        this.markers = [];

        // Ve lai marker
        markers.forEach(function(marker){
            var marker = that.getMarker(marker);
            that.layer1.add(marker);
            that.markers.push(marker);
        });
        
    }
    getMarker(marker){
        var that = this;

        // Chuyen doi toa do
        var Sw = this.background.scaleX()*this.background.width()/this.background.image().width;
        var Sy = this.background.scaleY()*this.background.height()/this.background.image().height;
        
        // Tạo marker
        var mk = new Konva.Image({
            x: marker.x*Sw,
            y: marker.y*Sy,
            width: 30,
            height: 30,
            image: this.imgMarker,
            draggable: true,
        });
        mk.data = marker;

        // Chức năng - tương tác tại đây
        mk.on('click', function(e){
            // Edit
            that.app.$store.dispatch('editInputMarker', {
                id: this.data.id
            })
        });

        mk.on('mouseover', function(){
            that.infoMarker.showMarker(this);
        });

        mk.on('mouseout', function(){
            that.infoMarker.hide();
        });

        mk.on('dragstart', function(){
            // console.log("START", this)
            console.log(this.x(), this.y());
        });

        mk.on('dragmove', function(){
            // console.log("MOVE", this);
        });

        mk.on('dragend', function(){
            var xR = that.background.image().width * this.x() / (that.background.scaleX() * that.background.width())
            var yR = that.background.image().height * this.y() / (that.background.scaleY() * that.background.height())
            if(confirm("Bạn muốn lưu toạ độ mới cho marker?")){
                that.app.$store.dispatch('createOrUpdateMarker', {
                    id: this.data.id,
                    x: parseInt(xR),
                    y: parseInt(yR),
                    name: this.data.name,
                    note: this.data.note
                })
            }
        })
        return mk;
    };
};

var mixin_marker = {
    mounted(){
        var that = this;
        this.view = new ViewMarker("canvas");
        this.view.onReady = this.onViewReady;
        this.view.app = this;
        setTimeout(function(){
            that.view.reloadMarker(that.markers);
        }, 1000);
    },
    methods: {
        onViewReady(){
            this.view.reloadMarker(this.markers);
        }
    }
}