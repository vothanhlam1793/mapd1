var width = window.innerWidth;
var height = window.innerHeight;
class IconMarker {
    constructor(){
        this.image = new Image();
        this.image.onload = function(){

        };
        this.image.src = "/marker.png";
    }
}

function getImage(){
    
}

class MarkerView {
    constructor(){
        this.image = getImage();
    }
}


class View {
    constructor(ctn){
        this.stage = new Konva.Stage({
            container: ctn,
            width: width,
            height: height
        });
        this.layer1 = new Konva.Layer();
        this.background = new Konva.Image();
        this.imgBackground = new Image();
        this.markers = [];  // Quan ly view
        this._initView();
    }
    _initView(){
        // Ve background
        var that = this;
        that.stage.add(that.layer1);
        this.imgBackground.onload = function(){
            that.background = new Konva.Image({
                x: 0,
                y: 0,
                image: this,
            });           
            that.layer1.add(that.background); 
        };
        this.imgBackground.src = "/my_image.png";
    }
    reloadMarker(){
        // Xoa va ve lai marker

    }
}

class Model {
    constructor(){
        this.markers = [];
        this.projects = [];
        this.onChangeData = function(){};
        this._fetchData();
    }
    _fetchData(){
        var that = this;
        graphql(QL_FETCH_MARKER).then(data=>{
            that.markers = data.data.allMarkers;
            that._commit();
        });
        graphql(QL_FETCH_PROJECT).then(data=>{
            that.projects = data.data.allProjects;
            that._commit();
        });
    }
    _commit(){
        this.onChangeData({markers: this.markers, projects: this.projects})
    }
    bindChangedData(callback){
        this.onChangeData = callback;
    }
}

class Controller {
    constructor(model, view){
        this.model = model;
        this.view = view;
        this.model.bindChangedData(this.updateData);
    }
    updateData = (data) => {
        // Xoa va ve lai marker
        this.view.reloadMarker();
    }
}

const app = new Controller(new Model(), new View("canvas"));