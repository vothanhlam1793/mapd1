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
    getProjectsByMarker(markerId){
        var projects = this.projects.filter(function(project){
            // console.log(project);
            return project.marker.id == markerId;
        });
        return projects;
    }
}

class Controller {
    constructor(model, view){
        this.model = model;
        this.view = view;
        this.model.bindChangedData(this.updateData);
        this.view.onHandleMarker = this.onHandleMarker;
        this.view.onLoadBackground = this.onHandleBackground;
    }
    updateData = (data) => {
        // Xoa va ve lai marker
        this.view.reloadMarker(this.model.markers);
    }

    onHandleMarker = (e, marker) => {
        var projects = this.model.getProjectsByMarker(marker.data.id);
        this.view.showInfo(projects);        
    }

    onHandleBackground = () => {
        this.view.reloadMarker(this.model.markers);
    }
}

const app = new Controller(new Model(), new View("canvas", width, height));