Vue.component('create-marker', {
    template: `
        <div>
            <div class="row m-1">
                <div class="col-6">
                    <label>X</label>
                    <input class="form-control" placeholder="Nhập X" v-model="x">
                </div>
                <div class="col-6">
                    <label>Y</label>
                    <input class="form-control" placeholder="Nhập Y" v-model="y">
                </div>
            </div>
            <div class="m-3">
                <input class="form-control" placeholder="Tên địa điểm" v-model="name"> 
            </div>
            <div>
                <button class="btn btn-success" @click="creteMarker()">Tạo</button>
            </div>
        </div>
    `,
    data: function(){
        return {
            x: 0,
            y: 0,
            name: ""
        }
    },
    methods: {
        creteMarker(){
            this.$store.dispatch('createOrUpdateMarker', {
                x: parseInt(this.x),
                y: parseInt(this.y),
                name: this.name
            }).then(data => {
                // DONE
                console.log(data);
            }).catch(data => {
                // ERROR
                console.log("ERROR", data);
            });
        }
    }
})




Vue.component('edit-marker', {
    data: function(){
        return {
            inpMarker: {}
        }
    },
    computed: {
        marker(){
            var that = this;
            var item = this.$store.state.markers.filter(function(marker){
                return marker.id == that.$store.state.editInputId;
            });
            if(item.length > 0){
                for([key, value] of Object.entries(item[0])){
                    that.inpMarker[key] = value;
                }
            }
            return item[0] || {};
        }
    },
    methods: {
        updateMarker(){
            this.$store.dispatch('createOrUpdateMarker', this.inpMarker);
        }
    },
    template: `
        <div>
            <p>{{marker.name}}</p>
            <div class="row m-1">
                <div class="col-6">
                    <label>X</label>
                    <input class="form-control" placeholder="Nhập X" v-model="inpMarker.x">
                </div>
                <div class="col-6">
                    <label>Y</label>
                    <input class="form-control" placeholder="Nhập Y" v-model="inpMarker.y">
                </div>
            </div>
            <div class="m-3">
                <input class="form-control" placeholder="Tên địa điểm" v-model="inpMarker.name"> 
            </div>
            <div class="m-3">
                <input class="form-control" placeholder="Ghi chú" v-model="inpMarker.note"> 
            </div>
            <div>
                <button class="btn btn-success" @click="updateMarker()">Lưu</button>
            </div>
        </div>
    `
});








Vue.component('item-marker', {
    props: ['id'],
    template: `
        <a class="list-group-item list-group-item-action">
            {{marker.name}} 
            - <button class="btn btn-warning" @click='editMarker()'>x</button> 
            - <button class="btn btn-danger" @click='deleteMarker()'>x</button>
        </a>
    `,
    computed: {
        marker(){
            var that = this;
            var item = this.$store.state.markers.filter(function(marker){
                return marker.id == that.$props.id;
            });
            return item[0] || {};
        }
    },
    methods: {
        deleteMarker(){
            this.$store.dispatch('deleteMarker', {id: this.$props.id}).then(data=>{
                console.log(data);
            });
        },
        editMarker(){
            this.$store.dispatch('editInputMarker', {id: this.$props.id});
        }
    }
});


Vue.component('create-project', {
    template: `
        <div>
            <div class="form-group">
                <label for="usr">Tên dự án</label>
                <input type="text" class="form-control" v-model="title">
            </div>
            <div class="form-group">
                <label for="pwd">Mô tả dự án</label>
                <input type="text" class="form-control" v-model="content">
            </div>
            <div class="form-group">
                <label for="pwd">Vị trí</label>
                <select class="form-control" v-model="idMarker">
                    <option v-for="marker in markers" :value="marker.id">{{marker.name}}</option>
                </select>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" @click="createProject()">Tạo</button>
            </div>
        </div>
    `,
    data: function(){
        return {
            title: "",
            content: "",
            idMarker: ""
        }
    },
    computed: {
        markers(){
            return this.$store.state.markers;
        }
    },
    methods: {
        createProject(){
            this.$store.dispatch('createOrUpdateProject', {
                title: this.title,
                content: this.content,
                marker: this.idMarker
            }).then(data => {
                console.log(data);
            });
        }
    }
})




Vue.component('item-project', {
    props: ["id"],
    template: `
        <div class="p-2 border border-warning rounded m-2">
            <h4 v-if="project.marker">{{project.marker.name}} | {{project.title}}</h4>
            <h4 v-else>Không địa điểm | {{project.title}}</h4>
            <p>{{project.content}}</p>
            <div>
                <button class="btn btn-warning" @click="editProject()">E</button>
                <button class="btn btn-danger" @click="deleteProject()">x</button>
            </div>
        </div>
    `,
    computed: {
        project(){
            var that = this;
            var item = this.$store.state.projects.filter(function(project){
                return project.id == that.$props.id;
            });
            return item[0] || {};
        }
    },
    methods: {
        deleteProject(){
            this.$store.dispatch('deleteProject', {id: this.$props.id}).then(data=>{
                console.log(data);
            });
        },
        editProject(){
            this.$store.dispatch('editInputProject', {id: this.$props.id});
        }
    }
})




Vue.component('edit-project', {
    template: `
        <div>
            <h2 v-if="project.id">{{project.title}}</h2>
            <div class="form-group">
                <label for="usr">Tên dự án</label>
                <input type="text" class="form-control" v-model="inputProject.title">
            </div>
            <div class="form-group">
                <label for="pwd">Mô tả dự án</label>
                <input type="text" class="form-control" v-model="inputProject.content">
            </div>
            <div class="form-group">
                <label for="pwd">Vị trí</label>
                <select class="form-control" v-model="inputProject.idMarker">
                    <option v-for="marker in markers" :value="marker.id">{{marker.name}}</option>
                </select>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" @click="updateProject()">Tạo</button>
            </div>
        </div>
    `,
    data: function(){
        return {
            inputProject: {}
        }
    },
    computed: {
        markers(){
            return this.$store.state.markers;
        },
        project(){
            var that = this;
            var item = this.$store.state.projects.filter(function(project){
                return project.id == that.$store.state.editInputProjectId;
            });
            if(item.length > 0){
                that.inputProject.title = item[0].title;
                that.inputProject.content = item[0].content;
                if(item[0].marker){
                    that.inputProject.idMarker = item[0].marker.id;
                } else {
                    that.inputProject.idMarker = "";
                }
                that.inputProject.id = item[0].id;
            }
            return item[0] || {};
        }
    },
    methods: {
        updateProject(){
            this.$store.dispatch('createOrUpdateProject', {
                id: this.inputProject.id,
                title: this.inputProject.title,
                content: this.inputProject.content,
                marker: this.inputProject.idMarker
            }).then(data => {
                console.log(data);
            });
        }
    }
})