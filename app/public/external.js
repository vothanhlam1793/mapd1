window.addEventListener("message", function (event) {
    console.log(event);
    if(event.data.type = 'scroll'){
        console.log(event.data);
        window.scrollTo(window.scrollX + event.data.scrollX, window.scrollY + event.data.scrollY);
    }
});