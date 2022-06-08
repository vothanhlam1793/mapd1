class Marker {
    constructor(id = "", obj = {}){
        this.id = id;
        this.attributes = obj;
    }
    fetch(){
        var that = this;
        graphql(QL_F_MARKER, {id: this.id}).then(data=>{
            that.attributes = data.data.Marker;
        });
    }
    save(){
        var that = this;
        that.attributes.x = parseInt(that.attributes.x);
        that.attributes.y = parseInt(that.attributes.y);
        if(that.id != ""){
            graphql(QL_UPDATE_MARKER, this.attributes).then(data => {
                console.log(data.data);
            })
        } else {
            // Create
            var obj = {
                note: that.attributes.note || "",
                x: that.attributes.x,
                y: that.attributes.y,
                name: that.attributes.name
            }
            graphql(QL_CREATE_MARKER, obj).then(data => {
                if(data.data.createMarker){
                    that.id = data.data.createMarker.id;
                    that.attributes = data.data.createMarker;
                    that.fetch();
                }
            })
        }
    }
    destroy(){
        graphql(QL_DELETE_MARKER, {id: this.id}).then(data=>{
            console.log(data);
        })
    }
}

class Project {
    constructor(id = "", obj = {}){
        this.id = id;
        this.attributes = obj;
    }
    fetch(){
        var that = this;
        graphql(QL_F_PROJECT, {id: this.id}).then(data=>{
            that.attributes = data.data.Project;
            if(that.attributes.marker){
                that.attributes.markerId = that.attributes.marker.id;
            }
        });
    }
    save(){
        var that = this;
        var obj = {
            marker: that.attributes.markerId,
            title: that.attributes.title,
            content: that.attributes.content
        }
        if(that.id != ""){
            // update
            graphql(QL_UPDATE_PROJECT, obj).then(data=>{

            })
        } else {
            // create
            graphql(QL_CREATE_PROJECT, obj).then(data=>{
                if(data.data.createProject){
                    that.id = data.data.createProject.id;
                    that.attributes = data.data.createProject;
                    that.fetch();
                }
            })
        }
    }
    destroy(){
        graphql(QL_DELETE_PROJECT, {id: this.id}).then(data=>{
            console.log(data);
        })
    }
}