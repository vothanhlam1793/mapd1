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


function outLayer(pos, pLayer){
    return {
      x: pos.x*pLayer.scaleX() + pLayer.x(),
      y: pos.y*pLayer.scaleY() + pLayer.y(),
    }
}

function inLayer(pos, layer){
    return {
      x: (pos.x - layer.x())/layer.scaleX(),
      y: (pos.y - layer.y())/layer.scaleY()
    }
}

function addPos(pos1, pos2){
    return {
        x: pos1.x + pos2.x,
        y: pos1.y + pos2.y
    };
}
function subPos(pos1, pos2){
    return {
        x: pos1.x - pos2.x,
        y: pos1.y - pos2.y
    };
}
function divPos(pos, n){
    return {
        x: pos.x / n,
        y: pos.y / n
    }
}
function mulPos(pos, n){
    return {
        x: pos.x * n,
        y: pos.y * n
    }
}
class View {
    constructor(ctn, w, h){
        this.stage = new Konva.Stage({
            container: ctn,
            width: w,
            height: h
        });
        this.stage.getContainer().style.backgroundColor = 'rgba(237,237,237,255)';
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
        this.hello = new Konva.Group();
        this.infoForm = new Konva.Group();
        this.listProject = new Konva.Group();
        this._initInfo();
        this._initView();
        this._initInteractive();
        this.onHandleMarker = function(){};
    }
    __toggleInfo(t){
        if(t == "hello"){
            this.hello.show();
            this.infoForm.hide();
        } else if (t == "info") {
            this.hello.hide();
            this.infoForm.show();
        }
    }
    _initMarker(){
        var that = this;
        var complexText = new Konva.Text({
            text: "Đà Nẵng",
            fontSize: 18,
            // fill: '#555',
            fontStyle: 'bold',
            // padding: 10,
            align: 'center',
            name: "nameMarker"
        });
        var rect = new Konva.Rect({
            width: complexText.width(),
            height: complexText.height(),
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
            that.infoMarker.x(that.infoMarker.marker.x() - (rects[0].width()/2 - 15)/that.layer1.scaleX());
            that.infoMarker.y(that.infoMarker.marker.y() - (20)/that.layer1.scaleX());
        }

        // Cai dat vao
        that.layer1.add(that.infoMarker);
        that.infoMarker.hide();
        whenFontIsLoaded(function () {
            // set font style when font is loaded
            // so Konva will recalculate text wrapping if it has limited width
            complexText.fontFamily('Montserrat');
        });
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
                y: 50,
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
                    stroke: '#B14406',
                    strokeWidth: 2,
                    fill: '#FFFFFF',
                    width: 300,
                    height: 420,
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
                    stroke: '#B14406',
                    strokeWidth: 2,
                    fill: '#FFFFFF',
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
                text: project.title,
                width: formForm.width() - 30,
                fontSize: 40,
                fontFamily: 'Montserrat',
                fontStyle: "700",
                align: 'left',
            });
            if(width < height){
                titleForm.fontSize(28);
            }
            var backButton = new Konva.Group();

            var backText = new Konva.Text({
                text: "Trở lại",
                fontSize: 18,
                fontFamily: 'Montserrat',
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
                that.__toggleInfo("hello");
                that.listProject.show();
            })
            // Tao mot doi tuong tai day
            // that.getContentImage(contentImage, project.content, formForm);


            var linkForm = new Konva.Text({
                x: 25,
                text: "Xem dự án",
                fontSize: 18,
                fontFamily: 'Montserrat',
                fill: '#555',
                padding: 10,
                align: 'center',
            })
            // Mo du an
            linkForm.on("click tap", function(){
                window.open("https://creta.vn", "_blank");
            });

            var urlImage = "/image/test.jpg"; //default
            if(project.image){
                urlImage = project.image.publicUrl;
            }
            // Anh
            Konva.Image.fromURL(urlImage, function(imageNode){
                var wMax = formForm.width() - 30;
                var w = imageNode.image().width;
                imageNode.setAttrs({
                    x: (formForm.width() - wMax)/2,
                    y: 15,
                    width: wMax,
                    scaleY: wMax / w
                });
                titleForm.position({
                    x: 15,
                    y: imageNode.y() + imageNode.height()*imageNode.scaleY() + 15
                });

                that.infoForm.add(formForm);
                that.infoForm.add(imageNode);
                that.infoForm.add(titleForm);

                function createItemInfo(key, value){
                    var gI = new Konva.Group();
                    var k = new Konva.Text({
                        x: 0,
                        y: 0,
                        text: key + ": ",
                        fontSize: 12,
                        fontFamily: 'Montserrat',
                        fontStyle: '600',
                        align: 'left', 
                    });
                    var v = new Konva.Text({
                        x: k.width(),
                        y: 0,
                        width: formForm.width() - 30 - k.width(),
                        text: value,
                        fontSize: 12,
                        fontFamily: 'Montserrat',
                        fontStyle: '300',
                        align: 'left', 
                    });
                    gI.add(k);
                    gI.add(v);
                    gI.height(v.height());
                    gI.width(formForm.width() - 30);
                    return gI;
                }
                var iP = createItemInfo("Địa điểm", project.place);
                iP.position({
                    y: titleForm.y() + titleForm.height() + 15,
                    x: 15
                })
                var iW = createItemInfo("Hạng mục", project.work);
                iW.position({
                    x: 15,
                    y: iP.y() + iP.height() + 5
                })
                var iC = createItemInfo("Thể loại công trình", project.category);
                iC.position({
                    x: 15,
                    y: iW.y() + iW.height() + 5
                })
                var iY = createItemInfo("Năm hoàn thành", project.category);
                iY.position({
                    x: 15,
                    y: iC.y() + iC.height() + 5
                })

                that.infoForm.add(iP);
                that.infoForm.add(iW);
                that.infoForm.add(iC);
                that.infoForm.add(iY);
                if(width<height){
                    // backButton.y(formForm.y() + formForm.height() - 20 - backForm.height());
                    // backButton.x(formForm.x() + formForm.width()/2 - backForm.width()/2);
                    // console.log(formForm.x(), backForm.width()/2);
                    // that.infoForm.add(backButton);
                }
                // Hien ra
                var nextPage = new Konva.Text({
                    x: 0,
                    y: 0,
                    width: (formForm.width() - 40)/2,
                    text: "Xem tiếp >",
                    fontSize: 15,
                    fontFamily: 'Montserrat',
                    fontStyle: 'bold',
                    align: 'right', 
                });
                nextPage.position({
                    x: formForm.width() - nextPage.width() - 15,
                    y: formForm.height() - 15 - nextPage.height()
                })
                nextPage.on("mouseover", function(e){
                    nextPage.fontSize(17);
                });
                nextPage.on("mouseout", function(e){
                    nextPage.fontSize(15);
                });
                nextPage.on("click tap", function(e){
                    // console.log(project);
                    window.open(project.url, "_blank");
                });
                if(project.url){
                    that.infoForm.add(nextPage);
                }
                // that.infoForm.show();

                var backPage = new Konva.Text({
                    x: 0,
                    y: 0,
                    width: (formForm.width() - 40)/2,
                    text: "< Trở lại",
                    fontSize: 15,
                    fontFamily: 'Montserrat',
                    fontStyle: 'bold',
                    align: 'left', 
                });
                backPage.position({
                    x: 15,
                    y: formForm.height() - 15 - nextPage.height()
                })
                backPage.on("mouseover", function(e){
                    nextPage.fontSize(17);
                });
                backPage.on("mouseout", function(e){
                    nextPage.fontSize(15);
                });
                backPage.on("click tap", function(e){
                    console.log(e);
                    // that.infoForm.hide();
                    that.__toggleInfo("hello");
                    that.listProject.show();
                });
                if(width<height){
                    that.infoForm.add(backPage);
                }
                // that.infoForm.show();
                that.__toggleInfo("info");
            });

        }
        // Ve cai thang info va them du lieu
        // that.infoForm.hide();
        that.__toggleInfo("hello");
        that.layer2.add(that.infoForm);


        // Xay List Project
        // Nếu máy tính
        if(width > height){
            that.listProject = new Konva.Group({
                x: width/4*3,
                y: 150,
            });
            var formList = new Konva.Rect({
                stroke: '#B14406',
                strokeWidth: 2,
                fill: '#FFFFFF',
                width: 217,
                height: 372,
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
                shadowOpacity: 0.2,
                cornerRadius: 10,
            })
        } else {
            // Tren mobile
            that.listProject = new Konva.Group({
                x: 50,
                y: 50,
            });
            var formList = new Konva.Rect({
                stroke: '#B14406',
                strokeWidth: 2,
                fill: '#FFFFFF',
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
            fontFamily: 'Montserrat',
            fill: '#555',
            padding: 10,
            align: 'center',
        });
        that.listProject.add(formList);
        // that.listProject.add(titleList);

        var list = new Konva.Group({
            x: 15,
            y: 15,
            name: 'list'
        });

        list.createItem = function(project, callback){
            
            var item = new Konva.Group();
            var titleItem = new Konva.Text({
                text: project.title,
                fontSize: 12,
                fontFamily: 'Montserrat',
                padding: 10,
                align: 'left',
            });
            var imgItem = new Image();
            imgItem.onload = function(){
                var imageItem = new Konva.Image({
                    image: imgItem,
                    width: 45,
                    height: 47,
                });
                var itemRect = new Konva.Rect({
                    stroke: '#B14406',
                    strokeWidth: 2,
                    cornerRadius: 5,
                    width: imageItem.width() + 5,
                    height: imageItem.height() + 5
                })
                imageItem.position({
                    x: (itemRect.width() - imageItem.width())/2,
                    y: (itemRect.height() - imageItem.width())/2
                });
                titleItem.position({
                    x: itemRect.width() + 5,
                    y: (itemRect.height() - titleItem.height())/ 2
                });
                var borderItem = new Konva.Rect({
                    height: itemRect.height(),
                    width: formList.width() - 20,
                    cornerRadius: 10,
                })
                item.add(borderItem);
                item.add(itemRect);
                item.add(imageItem);
                item.add(titleItem);
                item.h = borderItem.height();
                item.height(borderItem.height());
                item.width(borderItem.width());     
                item.on("mouseover", function(e){
                    borderItem.fill("#555555");
                })
                item.on("mouseout", function(e){
                    borderItem.fill("#FFFFFF");
                })
                if(callback){
                    callback(item);
                }        
            }
            if(project.image){
                imgItem.src = project.image.publicUrl; //src image
            } else {
                imgItem.src = "/my_image.png"; //src image
            }

            item.on('click', function(){
                // Mo / chuyen thong tin
                that.infoForm.updateData(project);
                // that.infoForm.show();
                that.__toggleInfo("info");
            });
            item.on('tap', function(){
                that.infoForm.updateData(project);
                // that.infoForm.show()
                that.__toggleInfo("info");
                that.listProject.hide();
            })
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
                lists[0].createItem(projects[i], function(item){
                    var j = lists[0].children.length;
                    item.y(j * item.h + 12*j);
                    lists[0].add(item);
                });
            }
            that.listProject.show();
            that.lockBackground = 1;
        }
        that.listProject.add(list);

        that.listProject.hide();
        that.layer2.add(that.listProject);

        // LOGO
        that.logo = new Konva.Group();
        var textLogo = new Konva.Text({
            fill: "#B14406",
            text: "OUR PORTFOLIO",
            fontSize: 28,
            fontStyle: '800',
            fontFamily: 'Montserrat',
            align: 'left',
        });
        var imgLogo = new Image();
        imgLogo.onload = function(){
            var imageLogo = new Konva.Image({
                image: imgLogo,
                height: textLogo.height(), 
                scaleX: textLogo.height() / imgLogo.height
            });
            imageLogo.position({
                x: textLogo.width() + 10,
                y: (textLogo.height() - imageLogo.height())/2
            })
            
            that.logo.add(textLogo);
            that.logo.add(imageLogo);
            that.logo.width(imageLogo.x() + imageLogo.width());
            that.logo.height(Math.max(imageLogo.height(), textLogo.height()));
            that.logo.position({
                x: 50,
                y: that.stage.height() - 100
            });
            that.layer2.add(that.logo);
        };
        imgLogo.src = "/v14.png";

        // HELLO
        that.hello = new Konva.Group();
        if(width>height){
            that.hello.width(300);
        }
        var t1Hello = new Konva.Text({
            text: "YOUR DREAM",
            width: that.hello.width(),
            fontSize: 28,
            fontStyle: '700',
            fontFamily: 'Montserrat',
            align: 'left',
        });
        var t2Hello = new Konva.Text({
            text: "WE BUILD",
            width: that.hello.width(),
            fontSize: 28,
            fontStyle: '700',
            fontFamily: 'Montserrat',
            align: 'right',
        });
        var cHello = new Konva.Text({
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus ut sapien vel quis vel dui. Sed libero cras urna nisl ut ut feugiat. Et ut duis duis lorem et mauris. Eget aliquam aliquet varius et sollicitudin. Fringilla dignissim aenean massa, aliquet neque, neque dis rhoncus, nulla. ",
            width: that.hello.width(),
            fontSize: 12,
            fontStyle: '400',
            fontFamily: 'Montserrat',
            align: 'left',
        });
        t2Hello.position({
            y: t1Hello.height()
        });
        cHello.position({
            y: t2Hello.y() + t2Hello.height() + 30
        });
        that.hello.add(t1Hello);
        that.hello.add(t2Hello);
        that.hello.add(cHello);
        that.hello.position({
            x: 50,
            y: 50
        });
        that.layer2.add(that.hello);
    }
    _setNewPosition(newPos, callback){
        var that = this;
        var nowPos = this._getCenterMap();
        var delPos = subPos(newPos, nowPos);
        var TIMESMOOD = 20;
        var STEPPOS = 50;
        var direcPos = {
            x: 1,
            y: 1
        }
        // STEP
        delPos = divPos(delPos, STEPPOS);
        var N = Math.round(Math.max(Math.abs(delPos.x), Math.abs(delPos.y)));
        var sPos = divPos(subPos(newPos, nowPos), N);
        var k = 0;
        // console.log("HERE");
        var d = setInterval(function(){
            if(k < N){
                k = k + 1;
                that._setCenter(addPos(nowPos, mulPos(sPos, k)));
            } else {
                clearInterval(d);
                if(callback){
                    callback(newPos);
                }
            }
        }, TIMESMOOD);
    }
    _setZoom(newScale, posCenter, callback){
        // Hieu ung luon nha :))
        var that = this;
        var oldScale = that.layer1.scaleX();
        var TILEZOOM = 0.1;
        var SMOODTIME = 50;
        var n = Math.round(Math.abs(newScale - oldScale)/TILEZOOM);
        // console.log("COUNTER:", n);
        if(n > 0){
            var direction;
            if(newScale > oldScale){
                direction = 1;
            } else {
                direction = -1;
            }
            var nScale = oldScale;
            var i = 0;
            var nowPos = this._getCenterMap();
            var sPos = divPos(subPos(posCenter, nowPos), n);
            var d = setInterval(function(){
                nScale = oldScale + i*direction*TILEZOOM;
                that.layer1.scale({ x: nScale, y: nScale});
                that._setCenter(addPos(nowPos, mulPos(sPos, i)));
                that.__notChangeWhenZoom()
                i = i + 1;
                if(i > n){
                    clearInterval(d);
                    if(callback){
                        callback();
                    } 
                }
            }, SMOODTIME);
        } else {
            that._setNewPosition(posCenter, callback);
        }

    }
    __notChangeWhenZoom(){
        var that = this;
        var newScale = that.layer1.scaleX();
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
    }
    _zoom(mousePointTo, direction, oldScale, pointer){
        var that = this;
        var newScale = direction > 0 ? oldScale * that.scaleBy : oldScale / that.scaleBy;
        if(newScale < 1){
            newScale = 1;
        }
        that.layer1.scale({ x: newScale, y: newScale });
    
        // Cac thong so khong thay doi khi scale
        that.__notChangeWhenZoom();
        
        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        // Cap nhat vi tri
        that.layer2.x(-newPos.x);
        that.layer2.y(-newPos.y);

        that.stage.position(newPos);
    }
    _setCenter(pos){
        var that = this;
        // pos layer1
        // Dua theo toa do w, h cua background
        // console.log(this.background.scale(), this.background.position());
        var pL = {
            x: pos.x*this.background.scaleX(),
            y: pos.y*this.background.scaleY()
        };
        
        var newPos = {
            x: -1 * pL.x * this.layer1.scaleX() + this.stage.width()/2,
            y: -1 * pL.y * this.layer1.scaleY() + this.stage.height()/2
        };
        // console.log(newPos, pos);
        that.stage.position(newPos);
        that.layer2.x(-newPos.x);
        that.layer2.y(-newPos.y);
    }
    _initInteractive(){
        var that = this;
        this.background.on('click tap', function(){
        
        });
        this.layer1.on('click tap', function(){
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
                    // that.infoForm.hide();
                    that.__toggleInfo("hello");
                    that.normalMarker();
                    that.oldForcusMarker = undefined;
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
            that.__notChangeWhenZoom();
            
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
                // Wheel
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
                var newScale;
                if(dist / lastDist > 1){
                    newScale = oldScale * 1.005;
                } else if (dist / lastDist < 1){
                    newScale = oldScale * 0.995;
                } else {
                    newScale = oldScale;
                }
                if(newScale < 1){
                    newScale = 1;
                }
                // that._setZoom(newScale, that._getCenterMap(newCenter));
                that.layer1.scale({ x: newScale, y: newScale });
            
                // // Cac thong so khong thay doi khi scale
                // // Kich thuoc marker
                that.__notChangeWhenZoom();
                
                // calculate new position of the stage
                var dx = newCenter.x - lastCenter.x;
                var dy = newCenter.y - lastCenter.y;

                var newPos = {
                    x: newCenter.x - pointTo.x * scale + dx,
                    y: newCenter.y - pointTo.y * scale + dy,
                };
                that._setCenter(that._getCenterMap(addPos(newCenter, {x: dx, y: dy})));
                // that.stage.position(newPos);
                // that.layer2.x(-newPos.x);
                // that.layer2.y(-newPos.y);

                lastDist = dist;
                lastCenter = newCenter;

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
                // console.log(newPos, maxHeight, maxWidth);
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
                // console.log(s);
                s = 0.2;
                that.background.scaleX(s);
                that.background.scaleY(s);
    
                var wi = that.background.width()*that.background.scaleX();
                var hi = that.background.height()*that.background.scaleY();
                
                // that.stage.x(-(1/16)*wi);
                // that.stage.y(-(1/4-1/16)*hi);
                that._setCenter({x: 4304 - 500, y: 2559});
                // that.layer2.x((1/16)*wi);
                // that.layer2.y((1/4-1/16)*hi);
            } else {
                var s = (1/(7/8-1/2))*w/that.imgBackground.width;
                console.log(s);
                that.background.scaleX(s);
                that.background.scaleY(s);
    
                var wi = that.background.width()*that.background.scaleX();
                var hi = that.background.height()*that.background.scaleY();
                
                // that.stage.x(-(1/2 - 1/16)*wi);
                // that.stage.y(-(1/4-1/8)*hi);   

                // that.layer2.x((1/2 - 1/16)*wi);
                // that.layer2.y((1/4-1/8)*hi);   
                that._setCenter({x: 4304 - 500, y: 2559});
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
    reloadMarker(markers, all){
        var that = this;
        // Xoa va ve lai marker
        this.markers.forEach(function(marker){
            marker.destroy();
        });
        this.markers = [];
        that.selectMarker = new SelectView("Chọn địa điểm");
        // Ve lai marker
        markers.forEach(function(marker){
            if(all){

            } else {
                if(marker.projects.length == 0){
                    return;
                }
            }
            var marker = that.getMarker(marker);
            that.layer1.add(marker);
            that.markers.push(marker);
            that.selectMarker.addItem(marker.data.name, function(){
                that.forcusMarker(marker);
            });
        });

        if(width>height){
            that.selectMarker.formSelect.position({
                x: width/4*3,
                y: height - 100,
            })
        } else {
            that.selectMarker.formSelect.position({
                x: (width - that.selectMarker.formSelect.width())/2,
                y: height - 50,
            })
        }
        setTimeout( function(){
            that.selectMarker.formSelect.children[1].text("Chọn vị trí");
        }, 2000)
        that.selectMarker.showUp();
        that.layer2.add(that.selectMarker.formSelect);
        
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
        mk.on('click tap', function(e){
            that.showInfo(mk.data.projects);
            that._setZoom(3, mk.data);
            that.infoMarker.show();
            that.markers.forEach(function(mke){
                if(mke._id == mk._id){
                    mke.opacity(1);
                } else {
                    mke.opacity(0.5);
                }
            });
        });

        mk.on('mouseover', function(){
            that.infoMarker.showMarker(this);
        });

        mk.on('mouseout', function(){
            that.infoMarker.hide();
            if(that.lockBackground == 2){
                that.infoMarker.show();
            }
        });

        // TOUCH PAD
        // mk.on('tap', function(e){
        //     that.onHandleMarker(e, this);
        // })

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
    _getCenterMap(pos){
        var that = this;
        var nowPos = that.stage.position();
        if(pos){
            nowPos = pos;
        }
        var pB = {
            x: (nowPos.x - that.stage.width()/2)/(-1*that.layer1.scaleX())/that.background.scaleX(),
            y: (nowPos.y - that.stage.height()/2)/(-1*that.layer1.scaleY())/that.background.scaleY()
        }
        return pB;
    }
    forcusMarker(marker){
        var that = this;
        if(!this.oldForcusMarker){
            this.oldForcusMarker = {
                data: that._getCenterMap()
            }
        }
        that._setZoom(1, this.oldForcusMarker.data, function(){      // Toa do da nang
            // Opacity
            that.markers.forEach(function(mk){
                if(mk._id == marker._id){
                    mk.opacity(1);
                } else {
                    mk.opacity(0.5);
                }
            });
            that.infoMarker.showMarker(marker);
            that._setZoom(3, {x: marker.data.x, y: marker.data.y}, function(){
                that.showInfo(marker.data.projects);
                that.lockBackground = 2;
            });
            that.oldForcusMarker = marker;
        }); 

    }
    normalMarker(){
        this.markers.forEach(function(mk){
            mk.opacity(1);
        })
    }
}