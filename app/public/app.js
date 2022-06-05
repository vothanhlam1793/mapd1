var width = window.innerWidth;
var height = window.innerHeight;
// first we need to create a stage
var stage = new Konva.Stage({
    container: 'canvas',   // id of container <div>
    width: width,
    height: height
});

// Layer back-ground
var layer1 = new Konva.Layer();
stage.add(layer1);

var phone = true;
var backgroundImage;
var imageObj = new Image();
imageObj.onload = function(){
    backgroundImage = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj
    });
    if(width < height){
        var w = 8*width/3;
        var h = imageObj.height * w / imageObj.width;
        var wa = imageObj.width;
        backgroundImage.width(w);
        backgroundImage.scaleY(w/wa);
        stage.height(imageObj.height * w / imageObj.width * (5/8));
        backgroundImage.x(-w*(7/16));
        backgroundImage.y(-h/6);
    } else {
        var h = height * 9 / 5;
        var w = imageObj.width * h / imageObj.height;
        var ha = imageObj.height;
        backgroundImage.height(h);
        backgroundImage.scaleX(h/ha);
        backgroundImage.y(-h/6);
    }
    layer1.add(backgroundImage);
}
imageObj.src = '/my_image.png';
