class SelectView {
    constructor(title){
        this.item = [];
        this.title = title;
        this.formSelect = new Konva.Group();
        this.isShowDown = true;
        this._init();
        this._initOption();
    }
    _initOption(){
        this.formOption = new Konva.Group();
        this.formOption.position({
            x: 0,
            y: this.formSelect.height()
        })
        this.formSelect.add(this.formOption);
        this.formOption.hide();
    }
    _init(){
        var that = this;
        var title = new Konva.Text({
            padding: 10,
            text: "                    ",
            name: "title"
        });

        var rect = new Konva.Rect({
            width: title.width() * 2,
            height: title.height(), 
            stroke: '#B14406',
            strokeWidth: 2,
            fill: '#FFFFFF',
            cornerRadius: 10,
        });

        this.formSelect.add(rect);
        this.formSelect.add(title);
        this.formSelect.width(rect.width());
        this.formSelect.height(rect.height());

        this.formSelect.on("click tap", function(){
            if(that.formOption.isVisible()){
                that.formOption.hide();
            } else {
                that.formOption.show();
            }
        })
    }
    createItem(name, callback){
        var that = this;
        var item = new Konva.Group();
        var title = new Konva.Text({
            width: this.formSelect.width(),
            padding: 7,
            text: name,
        });
        var rect = new Konva.Rect({
            width: this.formSelect.width(),
            height: title.height(), 
            fill: '#FFFFFF',
            stroke: 'black',
            strokeWidth: 1,
        });
        item.add(rect);
        item.add(title);
        item.width(rect.width());
        item.height(rect.height());
        item.on("tap click", function(){
            var t = that.formSelect.find('.title');
            t[0].text(name);

            // Callback support click
            if(callback){
                callback();
            }
        });
        return item;
    }
    addItem(name, callback){
        var item = this.createItem(name, callback);
        item.position({
            x: 0,
            y: this.formOption.height()
        })
        this.formOption.add(item);
        this.showLine();
    }
    deleteItem(index, callback){
        if(index >= this.formOption.children.length){
            return;
        }
        this.formOption.children[index].destroy();
        this.showLine();
        if(callback){
            callback();
        }
    }
    showLine(){
        if(this.isShowDown){
            this.showDown();
        } else {
            this.showUp();
        }
    }
    showUp(){
        var h = 0;
        for(var i = 0; i < this.formOption.children.length; i++){
            var item = this.formOption.children[this.formOption.children.length - 1 - i];
            item.position({
                x: 0,
                y: h
            });
            h = h + item.height();
        }
        this.formOption.height(h);
        this.formOption.position({
            x: 0,
            y: -1 * this.formOption.height()
        });
        this.isShowDown = false;
    }
    showDown(){
        var h = 0;
        for(var i = 0; i < this.formOption.children.length; i++){
            let item = this.formOption.children[i];
            item.position({
                x: 0,
                y: h
            });
            h = h + item.height(); // cap nhat height
        };
        this.formOption.height(h);
        this.isShowDown = true;
    }
}