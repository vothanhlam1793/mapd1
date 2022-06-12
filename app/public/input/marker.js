var width = window.innerWidth;
var height = window.innerHeight;
var a = 0;

var mixin_marker = {
    mounted(){
        var that = this;
        that.view = new View('canvas', width*2/3, height * 0.8);
        setTimeout(function(){
            that.view.reloadMarker(that.markers);
        }, 1000);
        that.view.onHandleMarker = that.handleClickMarker;
        that.view.extendMarker = that.handleExtendMarker;
    },
    methods: {
        onViewReady(){
            this.view.reloadMarker(this.markers);
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
                    })
                }
            })
        },
    }
}