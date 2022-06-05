var width = window.innerWidth;
var height = window.innerHeight;
// first we need to create a stage
var stage = new Konva.Stage({
    container: 'canvas',   // id of container <div>
    width: width,
    height: height
});

var layer = new Konva.Layer();
var layer2 = new Konva.Layer();
stage.add(layer);
stage.add(layer2);
var backgroundImage;
var lockBackground = false;
var complexText = new Konva.Text({
    x: 20,
    y: 60,
    text:
      "Đà Nẵng",
    fontSize: 18,
    fontFamily: 'Calibri',
    fill: '#555',
    padding: 10,
    align: 'center',
  });

  var rect = new Konva.Rect({
    x: 20,
    y: 60,
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
  });

  var complexText2 = new Konva.Text({
    x: width/4*3,
    y: 150,
    text:
      "Các dự án Đà Nẵng",
    fontSize: 18,
    fontFamily: 'Calibri',
    fill: '#555',
    padding: 10,
    align: 'center',
  });

  var complexText3 = new Konva.Text({
    x: width/4*3 + 25,
    y: 150 + complexText2.height() + 50,
    text:
      "Dự án 1",
    fontSize: 18,
    fontFamily: 'Calibri',
    fill: '#555',
    padding: 10,
    align: 'center',
  });


  var complexText4 = new Konva.Text({
    x: 100,
    y: 50,
    text:
      "Thông tin dự án 1",
    fontSize: 18,
    fontFamily: 'Calibri',
    fill: '#555',
    padding: 10,
    align: 'center',
  });
var rect2 = new Konva.Rect({
    x: width/4*3,
    y: 150,
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
});


var rect3 = new Konva.Rect({
    x: width/4*3 + 25,
    y: 150 + complexText2.height() + 50,
    stroke: '#555',
    strokeWidth: 2,
    fill: '#aaa',
    width: width/5 - 50,
    height: complexText3.height(),
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffsetX: 10,
    shadowOffsetY: 10,
    shadowOpacity: 0.2,
    cornerRadius: 10,
});

var rect4 = new Konva.Rect({
    x: 100,
    y: 50,
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


rect3.on('mouseover', function(){
    rect3.fill('#fff');
});
rect3.on('mouseout', function(){
    rect3.fill('#aaa');
});

rect3.on('click', function(){
    rect4.show();
    complexText4.show();
});

rect2.hide();
            complexText2.hide();
            rect3.hide();
            complexText3.hide();
            rect4.hide();
            complexText4.hide();
function setPos(x, y){
    rect.x(x);
    rect.y(y);
    complexText.x(x);
    complexText.y(y);
}

function showText(){
    rect.show();
    complexText.show();
}

function hideText(){
    rect.hide();
    complexText.hide();
}

var imageMaker = new Image();
var yoda;
var imageObj = new Image();
      imageObj.onload = function () {
        backgroundImage = new Konva.Image({
          x: -100,
          y: -200,
          image: imageObj,
        });
        var w = width + 100;
        var wa = backgroundImage.width();
        backgroundImage.width(w);
        backgroundImage.scaleY(w/wa);
        layer.add(backgroundImage);
        imageMaker.onload = function () {
            yoda = new Konva.Image({
              x: 875,
              y: 364,
              image: imageMaker,
              width: 30,
              height: 30,
              draggable: true,
            });
            // add the shape to the layer
            layer.add(yoda);
            yoda.on('mouseover', function(){
                setPos(yoda.x() - rect.width(), yoda.y() - rect.height());
                showText();
            })
            yoda.on('mouseout', function(){
                hideText();
            })
            yoda.on('click', function(){
                rect2.show();
                complexText2.show();
                rect3.show();
                complexText3.show();
                lockBackground = true;
            });
        };
        backgroundImage.on('click', function(){
            rect2.hide();
            complexText2.hide();
            rect3.hide();
            complexText3.hide();
            rect4.hide();
            complexText4.hide();
            lockBackground = false;
        })
        imageMaker.src = '/maker.png';
        // add the shapes to the layer
        layer.add(rect);
        layer.add(complexText);
        layer2.add(rect2);
        layer2.add(complexText2);
        layer2.add(rect3);
        layer2.add(complexText3);
        layer2.add(rect4);
        layer2.add(complexText4);
        hideText();
      };

      imageObj.src = '/my_image.png';

      var zoomLevel = 2;
      layer.on('mouseenter', function () {
        layer.scale({
          x: zoomLevel,
          y: zoomLevel,
        });
        yoda.scale({
          x: 1/layer.scale().x,
          y: 1/layer.scale().y,
        });
        console.log({
          x: 1/layer.scale().x,
          y: 1/layer.scale().y,
        });
      });

      layer.on('mousemove', function (e) {
          if(lockBackground){
              return;
          }
        var pos = stage.getPointerPosition();
        // console.log(pos);
        layer.x(-pos.x);
        layer.y(-pos.y);
      });

      layer.on('mouseleave', function () {
        // layer.x(0);
        // layer.y(0);
        // layer.scale({
        //   x: 1,
        //   y: 1,
        // });
      });
      layer.on('touchmove', function(){
        var pos = stage.getPointerPosition();
        // console.log(pos);
        layer.x(-pos.x);
        layer.y(-pos.y);
      })
      layer.on('touchstart', function () {
        layer.scale({
          x: zoomLevel,
          y: zoomLevel,
        });
        yoda.scale({
          x: 1/layer.scale().x,
          y: 1/layer.scale().y,
        });
        console.log({
          x: 1/layer.scale().x,
          y: 1/layer.scale().y,
        });
      });
      layer.on('touchend', function () {
        layer.scale({
          x: 1,
          y: 1,
        });
      });
      var circle = new Konva.Circle({
        x: stage.width() / 2,
        y: stage.height() / 2,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4,
      });

      
    