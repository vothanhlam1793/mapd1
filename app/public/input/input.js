var width = window.innerWidth;
var height = window.innerHeight;

var mixin_input = {
    mounted(){

    },  
    methods: {

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
            graphql(QL_FETCH_MARKER,{}).then(data=>{
                context.commit('uploadMarkers', data.data);
            });
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
                        context.dispatch('fetchMarkers');
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

var app = new Vue({
    el: "#app",
    mixins: [mixin_input],
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

const ql = `mutation uploadImageQuery ($file: Upload!){
    updateProject(id: "629f5988f56c6e25eed6ef8c", data: {
      image: $file,
    }) {
      id
      image {
        publicUrl
      }
    }
  }`
var a;
var b;
function onChange(e) {
    var rd = new FileReader();
    rd.onload = function(){
        var blob = new Blob([rd.result], {type: "image/png"});
        const url = URL.createObjectURL(blob, {type: "image/png"});
        a = url;
        b = blob;
        graphql(ql, {
            file: b
        }).then(data=>{
            console.log(data);
        })
    }
    rd.readAsArrayBuffer(e.files[0]);
}