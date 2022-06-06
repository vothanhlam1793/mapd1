const store = new Vuex.Store({
    state: {
        test: "Hello World",
        markers: [],
        projects: [],
    },
    mutations: {
        uploadMarkers(state, payload){
            state.markers = payload.allMarkers;
        },
        uploadProjects(state, payload){
            state.projects = payload.allProjects;
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
            var QL = "";
            var arr = "";
            if(payload.id){
                // upload
                QL = QL_UPDATE_MARKER;
                arr = "updateMarker"
            } else {
                // create
                QL = QL_CREATE_MARKER;
                arr = "createMarker";
            }
            graphql(QL_CREATE_MARKER, payload).then(data=>{
                if(data.data[arr].id){
                    context.dispatch('fetchMarkers');
                }
            })
        },
        createOrUpdateProject(context, payload){
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
            graphql(QL_CREATE_PROJECT, payload).then(data=>{
                if(data.data[arr].id){
                    context.dispatch('fetchProjects');
                }
            })
        }
    }
});

var app = new Vue({
    el: "#app",
    store,
    data: {

    },
    computed: {
        hello(){
            return this.$store.state.test;
        }
    },
    methods: {

    },
    created(){
        this.$store.dispatch('fetchMarkers');
        this.$store.dispatch('fetchProjects');
    }
});