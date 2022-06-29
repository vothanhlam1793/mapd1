var width = window.innerWidth;
var height = window.innerHeight;
var a = 0;

var mixin_marker = {
    mounted(){
        var that = this;
        var a = $("#stage")[0]
        that.view = new View('canvas', $(a).width(), $(a).height());
        setTimeout(function(){
            that.view.reloadMarker(that.markers, true);
        }, 1000);
        that.view.onHandleMarker = that.handleClickMarker;
        that.view.extendMarker = that.handleExtendMarker;
    },
    methods: {
        onViewReady(){
            this.view.reloadMarker(this.markers, true);
        },
        handleClickMarker(e, r){
            this.$store.dispatch('editInputMarker', {
                id: r.data.id
            })
        },
        handleExtendMarker(mk){
            var that = this;
            mk.on('dragend', function(){
                var xR = that.view.background.image().width * this.x() / (that.view.background.scaleX() * that.view.background.width())
                var yR = that.view.background.image().height * this.y() / (that.view.background.scaleY() * that.view.background.height())
                if(confirm("Bạn muốn lưu toạ độ mới cho marker?")){
                    that.$store.dispatch('createOrUpdateMarker', {
                        id: this.data.id,
                        x: parseInt(xR),
                        y: parseInt(yR),
                        name: this.data.name,
                        note: this.data.note
                    }).then(data=>{
                        that.$store.dispatch('fetchMarkers').then(data=>{
                            that.view.reloadMarker(that.markers, true);
                        });
                    });

                }
            })
        },
    }
}

const store = new Vuex.Store({
    state: {
        test: "Hello World",
        markers: [],
        projects: [],
        editInputId: "",
        editInputProjectId: ""
    },
    mutations: {
        uploadMarkers(state, payload){
            state.markers = payload.allMarkers;
        },
        uploadProjects(state, payload){
            state.projects = payload.allProjects;
        },
        editInputMarker(state, payload){
            state.editInputId = payload.id;
        },
        editInputProject(state, payload){
            state.editInputProjectId = payload.id;
        }
    },
    actions: {
        fetchMarkers(context, payload){
            return new Promise((resolve, reject)=>{
                graphql(QL_FETCH_MARKER,{}).then(data=>{
                    // console.log(data);
                    context.commit('uploadMarkers', data.data);
                    resolve(data.data);
                }).catch(e=>{
                    reject(e);
                });
            })
        },
        fetchProjects(context, payload){
            graphql(QL_FETCH_PROJECT,{}).then(data=>{
                context.commit('uploadProjects', data.data);
            })
        },
        createOrUpdateMarker(context, payload){
            return new Promise((resolve, reject)=>{
                var QL = "";
                var arr = "";
                if(payload.id){
                    // upload
                    QL = QL_UPDATE_MARKER;
                    arr = "updateMarker";
                    payload.note = payload.note || "";
                } else {
                    // create
                    QL = QL_CREATE_MARKER;
                    arr = "createMarker";
                }
                graphql(QL, payload).then(data=>{
                    console.log(data);
                    if(data.data[arr].id){
                        // context.dispatch('fetchMarkers');
                        resolve(data.data[arr]);
                    } else {
                        reject(data.data);
                    }
                })
            });
        },
        createOrUpdateProject(context, payload){
            return new Promise((resolve, reject)=>{
                var QL = "";
                var arr = "";
                if(payload.id){
                    // upload
                    QL = QL_UPDATE_PROJECT;
                    arr = "updateProject"
                } else {
                    // create
                    QL = QL_CREATE_PROJECT;
                    arr = "createProject";
                }
                graphql(QL, payload).then(data=>{
                    if(data.data[arr].id){
                        context.dispatch('fetchProjects');
                        resolve(data.data[arr]);
                    } else {
                        reject(data.data);
                    }
                })
            });
        },
        deleteMarker(context, payload){
            if(payload == undefined){
                payload = {};
            }
            return new Promise((resolve, reject)=>{
                if(payload.id){
                    graphql(QL_DELETE_MARKER, payload).then(data=>{
                        if(data.data['deleteMarker'].id){
                            context.dispatch('fetchMarkers');
                            resolve(data.data);
                        } else {
                            reject(data.data);
                        }
                    })
                } else {
                    reject({
                        message: "Not found id"
                    })
                }
            });
        },
        deleteProject(context, payload){
            if(payload.id){
                graphql(QL_DELETE_PROJECT, payload).then(data=>{
                    if(data.data['deleteProject'].id){
                        context.dispatch('fetchProjects');
                    }
                })
            }
        },
        editInputMarker(context, payload = {}){
            if(payload.id){
                context.commit('editInputMarker', payload);
            }
        },
        editInputProject(context, payload = {}){
            if(payload.id){
                context.commit('editInputProject', payload);
            }
        }
    }
});

if(!mixin_marker){
    var mixin_marker = {};
}
var app = new Vue({
    el: "#app",
    mixins: [mixin_marker],
    store,
    data: {

    },
    computed: {
        markers(){
            return this.$store.state.markers;
        },
        projects(){
            console.log(this.$store.state.projects);
            return this.$store.state.projects;
        },
    },
    methods: {

    },
    created(){
        this.$store.dispatch('fetchMarkers');
        this.$store.dispatch('fetchProjects');
    },
    mounted(){

    }
});