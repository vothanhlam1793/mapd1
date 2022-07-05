var width = window.innerWidth;
var height = window.innerHeight;

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
            if(LANGUAGE_DEFINE == 1){
                that.markers.forEach(function(marker){
                    marker.projects.forEach(function(project){
                        project.title = project.titleTA;
                        project.place = project.placeTA;
                        project.category = project.categoryTA;
                        project.work = project.workTA;
                    });
                    marker.name = marker.nameTA;
                });
            }
            that._commit();
        });
        graphql(QL_FETCH_PROJECT).then(data=>{
            that.projects = data.data.allProjects;
            if(LANGUAGE_DEFINE == 1){
                that.projects.forEach(function(project){
                    project.title = project.titleTA;
                    project.place = project.placeTA;
                    project.category = project.categoryTA;
                    project.work = project.workTA;
                });
            }
            that._commit();
        });
        graphql(QL_FETCH_HELLO).then(data=>{
            that.hellos = data.data.allHellos;
            if(LANGUAGE_DEFINE == 1){
                that.hellos.forEach(function(hello){
                    hello.descript = hello.descriptTA;
                    hello.title1 = hello.title1TA;
                    hello.title2 = hello.title2TA;
                });
            }
            that.updateHello();
        });
    }
    _commit(){
        this.onChangeData({markers: this.markers, projects: this.projects})
    }
    bindChangedData(callback){
        this.onChangeData = callback;
    }
    bindUpdateHello(callback){
        this.updateHello = callback;
    }
    getProjectsByMarker(markerId){
        var projects = this.projects.filter(function(project){
            if(project.marker){
                return project.marker.id == markerId;                
            } else {
                return false;
            }

        });
        return projects;
    }
}

class Controller {
    constructor(model, view){
        this.model = model;
        this.view = view;
        this.model.bindChangedData(this.updateData);
        this.model.bindUpdateHello(this.updateHello);
        this.view.onHandleMarker = this.onHandleMarker;
        this.view.onLoadBackground = this.onHandleBackground;
    }
    updateHello = ()=>{
        this.view._initHello(this.model.hellos);
    }
    updateData = (data) => {
        // Xoa va ve lai marker
        this.view.reloadMarker(this.model.markers);
    }

    onHandleMarker = (e, marker) => {
        this.view.forcusMarker(marker);   
    }

    onHandleBackground = () => {
        this.view.reloadMarker(this.model.markers);
    }
}

const app = new Controller(new Model(), new View("canvas", width, height));