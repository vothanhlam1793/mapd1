class View {
    constructor(ctn, w, h){
        this.stage = new Konva.Stage({
            container: ctn,
            width: w,
            height: h
        });
        this.layer1 = new Konva.Layer({
            // draggable: true,
        });
        this.layer2 = new Konva.Layer();

        this.scaleBy = 1.02;

        this.background = new Konva.Image();
        this.imgBackground = new Image();
        this.lockBackground = 0;
        this.onLoadBackground = function(){};

        this.imgMarker = new Image();
        this.imgMarker.src = "/maker.png"
        this.infoMarker = new Konva.Group();
        this.markers = [];  // Quan ly markers
        this.extendMarker = function(){};
        this._initMarker();
        
        this.projects = [];
        this.infoForm = new Konva.Group();
        this.listProject = new Konva.Group();
        this._initInfo();
        this._initView();
        this._initInteractive();

        this.onHandleMarker = function(){};
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
    }
    _initInfo(){
        var that = this;
        
        // Build Info Form
        that.infoForm = new Konva.Group({
            x: 100, 
            y: 50,
            name: "infoForm"
        });


        that.infoForm.updateData = function(project){
            // that.infoForm.hide();
            if(project){
                this.project = project;
            }
            // Xoa het cac element
            var k = that.infoForm.children.pop();
            while(k){
                k.destroy();
                k = that.infoForm.children.pop();
            }

            // Tao form
            var formForm = new Konva.Rect({
                x: 0,
                y: 0,
                stroke: '#555',
                strokeWidth: 2,
                fill: '#ddd',
                width: width/3,
                height: height - 100,
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
                shadowOpacity: 0.2,
                cornerRadius: 10,
            });

            // Tieu de
            var titleForm = new Konva.Text({
                x: 0,
                y: 0,
                text: "Thông tin dự án\n" + project.title,
                fontSize: 18,
                fontFamily: 'Calibri',
                fill: '#555',
                padding: 10,
                align: 'center',
            });

            // Gioi thieu
            var contentForm = new Konva.Text({
                x: 25,
                text: project.content,
                fontSize: 18,
                fontFamily: 'Calibri',
                fill: '#555',
                padding: 10,
                align: 'center',
            });

            var linkForm = new Konva.Text({
                x: 25,
                text: "Xem dự án",
                fontSize: 18,
                fontFamily: 'Calibri',
                fill: '#555',
                padding: 10,
                align: 'center',
            })
            // Mo du an
            linkForm.on("click", function(){
                window.open("https://creta.vn", "_blank");
            });

            // Anh
            Konva.Image.fromURL("/image/test.jpg", function(imageNode){
                var wMax = formForm.width() - 50;
                var w = imageNode.image().width;
                imageNode.setAttrs({
                    x: 25,
                    y: titleForm.height() + 20,
                    width: wMax,
                    scaleY: wMax / w
                });
                
                contentForm.y(imageNode.y() + imageNode.height()*imageNode.scaleY() + 20);
                linkForm.y(contentForm.y() + contentForm.height() + 20);
                that.infoForm.add(formForm);
                that.infoForm.add(titleForm);
                that.infoForm.add(imageNode);
                that.infoForm.add(contentForm);
                that.infoForm.add(linkForm);

                // Hien ra
                that.infoForm.show();
            });

        }
        // Ve cai thang info va them du lieu
        that.infoForm.hide();
        that.layer2.add(that.infoForm);


        // Xay List Project
        that.listProject = new Konva.Group({
            x: width/4*3,
            y: 150,
        });
        var formList = new Konva.Rect({
            stroke: '#555',
            strokeWidth: 2,
            fill: '#ddd',
            width: width/5,
            height: height - 300,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowOpacity: 0.2,
            cornerRadius: 10,
        })

        var titleList = new Konva.Text({
            text: "Các dự án Đà Nẵng",
            fontSize: 18,
            fontFamily: 'Calibri',
            fill: '#555',
            padding: 10,
            align: 'center',
        });
        that.listProject.add(formList);
        that.listProject.add(titleList);

        var list = new Konva.Group({
            x: 25,
            y: titleList.height() + 50,
            name: 'list'
        });

        list.createItem = function(project){
            var item = new Konva.Group();
            var titleItem = new Konva.Text({
                text: project.title,
                fontSize: 18,
                fontFamily: 'Calibri',
                fill: '#555',
                padding: 10,
                align: 'center',
            });
            var rectItem = new Konva.Rect({
                stroke: '#555',
                strokeWidth: 2,
                fill: '#aaa',
                width: width/5 - 50,
                height: titleItem.height(),
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
                shadowOpacity: 0.2,
                cornerRadius: 10,
            });
            item.add(rectItem);
            item.add(titleItem);
            item.h = titleItem.height();

            item.on('click', function(){
                // Mo / chuyen thong tin
                that.infoForm.updateData(project);
                that.infoForm.show();
            });
            return item;
        }

        that.listProject.createList = function(projects){
            if(projects){
                that.projects = projects;
            }
            titleList.text("Dự án " + that.projects[0].marker.name);

            var lists  = that.listProject.find('.list');
            // Xoa mo cu
            var k = lists[0].children.pop();
            while(k){
                k.destroy();
                k = lists[0].children.pop();
            }

            // Tao cai moi
            for(var i = 0; i < that.projects.length; i++){
                let item = lists[0].createItem(projects[i]);
                item.y(i * item.h + 10*i);
                lists[0].add(item);
            }
            that.listProject.show();
            that.lockBackground = 1;
        }
        that.listProject.add(list);

        that.listProject.hide();
        that.layer2.add(that.listProject);
    }
    _initInteractive(){
        var that = this;
        this.background.on('click', function(){
        
        });
        this.layer1.on('click', function(){
            // console.log("laery1");
            switch(that.lockBackground){
                case 0: {

                } break;
                case 1: {
                    that.lockBackground = 2;
                } break;
                case 2: {
                    that.lockBackground = 0;
                    that.listProject.hide();
                    that.infoForm.hide();
                }
            }
        })

        this.layer2.on('click', function(){
            // console.log("layer2");
        })
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

            // Cap nhat vi tri
            that.layer2.x(-newPos.x);
            that.layer2.y(-newPos.y);

            that.stage.position(newPos);
        });
        var stateMouse = 0;
        var oldMouse = {};
        that.stage.on('mousedown', function(){
            stateMouse = 1;
            oldMouse = that.stage.getPointerPosition();
        })
        that.stage.on('mousemove', function(){
            if(stateMouse == 1){
                var mousePos = that.stage.getPointerPosition();
                var newPos = {
                    x: that.stage.x() + (mousePos.x - oldMouse.x),
                    y: that.stage.y() + (mousePos.y - oldMouse.y)
                }
                var maxWidth = that.layer1.width()*that.layer1.scale().x;
                var maxHeight = that.layer1.height()*that.layer1.scale().y;
                if(newPos.x < -(maxWidth - that.stage.width())){
                    newPos.x = -(maxWidth - that.stage.width());
                }
                if(newPos.x > 0){
                    newPos.x = 0;
                }
                if(newPos.y < -(maxHeight - that.stage.height())){
                    newPos.y = -(maxHeight - that.stage.height());
                }
                if(newPos.y > 0){
                    newPos.y = 0;
                }
                that.stage.position(newPos);
                that.layer2.x(-newPos.x);
                that.layer2.y(-newPos.y);
                oldMouse = mousePos;
            }
        })
        that.stage.on('mouseup', function(){
            stateMouse = 0;
        })
    }
    _initView(){
        // Ve background
        var that = this;
        that.stage.add(that.layer1); // Background
        that.stage.add(that.layer2); // Info project

        // Hide
        // that.layer2.hide();

        this.imgBackground.onload = function(){
            that.background = new Konva.Image({
                x: 0,
                y: 0,
                image: this,
            });           

            // Canh chi vi tri
            var w = that.stage.width();
            var wa = that.background.width();
            that.background.width(w);
            that.background.scaleY(w/wa);

            // Them layer1 vao background
            that.layer1.add(that.background);
            that.onLoadBackground();
        };
        this.imgBackground.src = "/my_image.png";
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
        var Sw = this.background.scaleX()*this.background.width()/this.imgBackground.width;
        var Sy = this.background.scaleY()*this.background.height()/this.imgBackground.height;
        
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
            that.onHandleMarker(e, this);
        });

        mk.on('mouseover', function(){
            that.infoMarker.showMarker(this);
        });

        mk.on('mouseout', function(){
            that.infoMarker.hide();
        });
        that.extendMarker(mk);
        return mk;
    };
    showInfo(projects){
        this.projects = projects;
        this.listProject.createList(projects);
    }
}