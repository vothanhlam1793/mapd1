class List {
    constructor(list){
        this.list = list;
        this.group = new Konva.Group({
            x: 0, 
            y: 0
        });
        this.listForm = new Konva.Group();
        this.oY = 0;
        this._init();
        this._initList();
    }
    _init(){
        this.rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 300,
            height: 200,
            fill: "grey"
        })
        this.group.add(this.rect);
        this.rect.on('wheel', this.wheelAction);
    }
    _initList(){
        var that = this;
        for(var i = 0; i < this.list.length; i++){
            let text = new Konva.Text({
                text: this.list[i],
                fontSize: 18,
                fontFamily: 'Calibri',
                fill: '#555',
                padding: 10,
            });
            let rectItem = new Konva.Rect({
                width: 270,
                height: text.height(),
                fill: '#ddd',
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
                shadowOpacity: 0.2,
                cornerRadius: 10,
            });
            let item = new Konva.Group({
                x: that.rect.x() + 5,
                y: that.rect.y() + 5 + i*(rectItem.height() + 3)
            });
            item.add(rectItem);
            item.add(text);

            item.on('wheel', this.wheelAction);
            this.addTouch(item);
            this.listForm.add(item);
        }
        var iL = this.listForm.children[0].children[0].height();
        var mLH = iL * this.listForm.children.length;
        var hF = this.rect.height() - 50;
        for(var j = 0; j < this.listForm.children.length; j++){
            if(j > parseInt(hF/iL)){
                this.listForm.children[j].opacity(0);
            }
            if (j == parseInt(hF/iL) + 1){
                this.listForm.children[j].opacity(0.5);
            }                
        }
        that.group.add(this.listForm);
    }
    wheelAction = (e)=>{
        e.evt.preventDefault();
        var iL = this.listForm.children[0].children[0].height();
        var mLH = iL * this.listForm.children.length;
        var hF = this.rect.height() - 50;
        var Ymax = mLH - hF;
        var Ymin = 0;
        var Y = this.oY + e.evt.deltaY;
        if(Y < Ymin){
            return;
        } else if (Y > Ymax){
            return;
        } else {
            this.oY = this.oY + e.evt.deltaY;
        }
        var hideTop = parseInt(this.oY/iL);
        var hideBot = parseInt((mLH - this.oY - hF)/iL);
        var lI = this.listForm.children.length;
        for(var j = 0; j < this.listForm.children.length; j++){
            if((j > 0) && (j <= hideTop - 2)){
                // An tren
                this.listForm.children[j].opacity(0);
            } else if (j == hideTop - 1) {
                this.listForm.children[j].opacity(0.5);
            } else if ((j >= hideTop) && (j <= lI - hideBot - 1)){
                this.listForm.children[j].opacity(1);
            } else if (j == lI - hideBot) {
                this.listForm.children[j].opacity(0.5);
            } else {
                this.listForm.children[j].opacity(0);
            }
            this.listForm.children[j].y(this.listForm.children[j].y() - e.evt.deltaY);                    
        }
    }
    addTouch(ele){
        ele.on('touchstart', function(e){

        });
        ele.on('touchmove', function(e){
            
        });
        ele.on('touchend', function(e){
            
        });
        ele.on('tap', function(e){
            
        });
        ele.on('dbtap', function(e){
            
        });
    }
}