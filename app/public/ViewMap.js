function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCenter(p1, p2) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
}
var lastCenter = null;
var lastDist = 0;

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
            that.infoMarker.moveToTop();
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
        if(width>height){
            that.infoForm = new Konva.Group({
                x: 100, 
                y: 50,
                name: "infoForm"
            });
        } else {
            that.infoForm = new Konva.Group({
                x: 50, 
                y: 100,
                name: "infoForm"
            });
        }



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
            if(width > height){
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
                    name: 'formForm'
                });
            } else {
                var formForm = new Konva.Rect({
                    x: 0,
                    y: 0,
                    stroke: '#555',
                    strokeWidth: 2,
                    fill: '#ddd',
                    width: width - 100,
                    height: height - 200,
                    shadowColor: 'black',
                    shadowBlur: 10,
                    shadowOffsetX: 10,
                    shadowOffsetY: 10,
                    shadowOpacity: 0.2,
                    cornerRadius: 10,
                    name: 'formForm'
                });
            }


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

            var contentImage = new Konva.Image({
                x: 25
            })

            var backButton = new Konva.Group();
            var backText = new Konva.Text({
                text: "Trở lại",
                fontSize: 18,
                fontFamily: 'Calibri',
                fill: '#555',
                padding: 10,
                align: 'center',
            });
            var backForm = new Konva.Rect({
                stroke: '#555',
                strokeWidth: 2,
                fill: '#aaa',
                width: backText.width(),
                height: backText.height(),
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
                shadowOpacity: 0.2,
                cornerRadius: 10,
            })
            backButton.add(backForm);
            backButton.add(backText);
            backButton.on('tap', function(e){
                console.log(e);
                that.infoForm.hide();
                that.listProject.show();
            })
            // Tao mot doi tuong tai day
            that.getContentImage(contentImage, project.content, formForm);

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
            var urlImage = "/image/test.jpg"; //default
            if(project.image){
                urlImage = project.image.publicUrl;
            }
            // Anh
            Konva.Image.fromURL(urlImage, function(imageNode){
                var wMax = formForm.width() - 50;
                var w = imageNode.image().width;
                imageNode.setAttrs({
                    x: 25,
                    y: titleForm.height() + 20,
                    width: wMax,
                    scaleY: wMax / w
                });
                
                // contentForm.y(imageNode.y() + imageNode.height()*imageNode.scaleY() + 20);
                contentImage.y(imageNode.y() + imageNode.height()*imageNode.scaleY() + 20);
                // linkForm.y(contentForm.y() + contentForm.height() + 20);
                linkForm.y(contentForm.y() + contentImage.height() + 20);

                that.infoForm.add(formForm);
                that.infoForm.add(titleForm);
                that.infoForm.add(imageNode);
                // that.infoForm.add(contentForm);
                that.infoForm.add(contentImage);
                // that.infoForm.add(linkForm);
                console.log(formForm.y() + formForm.height() - 20 - backForm.height());
                if(width<height){
                    backButton.y(formForm.y() + formForm.height() - 20 - backForm.height());
                    backButton.x(formForm.x() + formForm.width()/2 - backForm.width()/2);
                    console.log(formForm.x(), backForm.width()/2);
                    that.infoForm.add(backButton);
                }
                // Hien ra
                that.infoForm.show();
            });

        }
        // Ve cai thang info va them du lieu
        that.infoForm.hide();
        that.layer2.add(that.infoForm);


        // Xay List Project
        // Nếu máy tính
        if(width > height){
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
        } else {
            that.listProject = new Konva.Group({
                x: 50,
                y: 100,
            });
            var formList = new Konva.Rect({
                stroke: '#555',
                strokeWidth: 2,
                fill: '#ddd',
                width: width - 100,
                height: height - 200,
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
                shadowOpacity: 0.2,
                cornerRadius: 10,
            })
        }

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
            if(width>height){
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
            } else {
                var rectItem = new Konva.Rect({
                    stroke: '#555',
                    strokeWidth: 2,
                    fill: '#aaa',
                    width: width - 150,
                    height: titleItem.height(),
                    shadowColor: 'black',
                    shadowBlur: 10,
                    shadowOffsetX: 10,
                    shadowOffsetY: 10,
                    shadowOpacity: 0.2,
                    cornerRadius: 10,
                });
            }
            item.add(rectItem);
            item.add(titleItem);
            item.h = titleItem.height();

            item.on('click', function(){
                // Mo / chuyen thong tin
                that.infoForm.updateData(project);
                that.infoForm.show();
            });
            item.on('tap', function(){
                that.infoForm.updateData(project);
                that.infoForm.show()
                that.listProject.hide();
            })
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
        this.layer1.on('tap', function(){
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
                marker.center(1/newScale);
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

        that.stage.on('touchmove', function(e){
            e.evt.preventDefault();
            var touch1 = e.evt.touches[0];
            var touch2 = e.evt.touches[1];
            // alert(touch2);
            // alert(touch1);
            if (touch1 && touch2) {
                if (that.stage.isDragging()) {
                    that.stage.stopDrag();
                }

                var p1 = {
                    x: touch1.clientX,
                    y: touch1.clientY,
                };
                var p2 = {
                    x: touch2.clientX,
                    y: touch2.clientY,
                };
                // alert("HERE-1");
                if (!lastCenter) {
                    lastCenter = getCenter(p1, p2);
                    return;
                }
                // alert("HERE-5");
                var newCenter = getCenter(p1, p2);
                // alert("HERE-3");
                var dist = getDistance(p1, p2);
                // alert("HERE-4");
                if (!lastDist) {
                    lastDist = dist;
                }
                
                var pointTo = {
                    x: (newCenter.x - that.stage.x()) / that.stage.scaleX(),
                    y: (newCenter.y - that.stage.y()) / that.stage.scaleX(),
                };
                //Scale
                // alert("HERE-1");
                var oldScale = that.layer1.scaleX();
                var newScale = oldScale * (dist / lastDist);
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
                    marker.center(1/newScale);
                })
                // Kich thuoc info marker
                that.infoMarker.scale({
                    x: 1/newScale,
                    y: 1/newScale
                });
    
                // Khoang cach info marker
                that.infoMarker.adjustIndex();
                that.stage.position(newPos);

            } else {
                var mousePos = that.stage.getPointerPosition();
                var newPos = {
                    x: that.stage.x() + (mousePos.x - oldMouse.x),
                    y: that.stage.y() + (mousePos.y - oldMouse.y)
                }
                var maxWidth = that.layer1.width()*that.layer1.scale().x;
                var maxHeight = that.layer1.height()*that.layer1.scale().y;
                
                // if(newPos.x < -(maxWidth - that.stage.width())){
                //     newPos.x = -(maxWidth - that.stage.width());
                // }
                // if(newPos.x > 0){
                //     newPos.x = 0;
                // }
                // if(newPos.y < -(maxHeight - that.stage.height())){
                //     newPos.y = -(maxHeight - that.stage.height());
                // }
                // if(newPos.y > 0){
                //     newPos.y = 0;
                // }
                that.stage.position(newPos);
                that.layer2.x(-newPos.x);
                that.layer2.y(-newPos.y);
                
                oldMouse = mousePos;
            }
        })

        that.stage.on('touchend', function () {
            lastDist = 0;
            lastCenter = null;
        });


        var stateMouse = 0;
        var oldMouse = {};
        that.stage.on('mousedown touchstart', function(){
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

                // if(newPos.x < -(maxWidth - that.stage.width())){
                //     newPos.x = -(maxWidth - that.stage.width());
                // }
                // if(newPos.x > 0){
                //     newPos.x = 0;
                // }
                // if(newPos.y < -(maxHeight - that.stage.height())){
                //     newPos.y = -(maxHeight - that.stage.height());
                // }
                // if(newPos.y > 0){
                //     newPos.y = 0;
                // }

                that.stage.position(newPos);
                that.layer2.x(-newPos.x);
                that.layer2.y(-newPos.y);
                oldMouse = mousePos;
                console.log(newPos, maxHeight, maxWidth);
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

        // Scale layer1
        that.layer1.scaleWidthBackground = function(){
            // Neu la pc
            var w = that.stage.width();
            var h = that.stage.height();
            if(w > h){
                var s = (1/(3/4-1/4))*h/that.imgBackground.height;
                
                that.background.scaleX(s);
                that.background.scaleY(s);
    
                var wi = that.background.width()*that.background.scaleX();
                var hi = that.background.height()*that.background.scaleY();
                
                that.layer1.x(-(1/16)*wi);
                that.layer1.y(-(1/4-1/16)*hi);
            } else {
                var s = (1/(7/8-1/2))*w/that.imgBackground.width;
                
                that.background.scaleX(s);
                that.background.scaleY(s);
    
                var wi = that.background.width()*that.background.scaleX();
                var hi = that.background.height()*that.background.scaleY();
                
                that.layer1.x(-(1/2 - 1/16)*wi);
                that.layer1.y(-(1/4-1/8)*hi);   
            }
        }

        // Hide
        // that.layer2.hide();

        this.imgBackground.onload = function(){
            that.background = new Konva.Image({
                x: 0,
                y: 0,
                image: this,
            });           

            that.layer1.scaleWidthBackground();
            // Canh chi vi tri

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
            if(marker.projects.length == 0){
                return;
            }
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
        mk.Sw = Sw;
        mk.Sy = Sy;

        mk.center = function(s){
            mk.x(mk.data.x*mk.Sw - mk.width()/2*s);
            mk.y(mk.data.y*mk.Sy - mk.height()/2*s);
        }
        mk.scale({
            x: 1/that.layer1.scaleX(),
            y: 1/that.layer1.scaleX()
        })
        mk.center(1/that.layer1.scaleX());        
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

        // TOUCH PAD
        mk.on('tap', function(e){
            that.onHandleMarker(e, this);
        })

        that.extendMarker(mk);
        return mk;
    };
    showInfo(projects){
        this.projects = projects;
        this.listProject.createList(projects);
    }
    getContentImage(image, content, formForm){
        var that = this;
        var b = $("<div style='width: 400px; height: 320px'></div>");
        b.html(content);
        console.log(b);
        document.body.appendChild(b[0]);
        html2canvas(b[0], {
            backgroundColor: 'rgba(0,0,0,0)',
        }).then((canvas) => {
            var wMax = formForm.width() - 50;
            var w = canvas.width;
            // show it inside Konva.Image
            image.image(canvas);
            image.width(wMax);
            image.scaleY(wMax/w);
            
        });
    }
}