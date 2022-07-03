window.addEventListener("message", function (event) {
    if(event.data.type = 'scroll'){
        window.scrollTo(window.scrollX + event.data.scrollX, window.scrollY + event.data.scrollY);
        if(event.data.scrollY > 0){
            location.hash="news";
        } else if (event.data.scrollY < 0){
            location.hash="wellcome";
        }
    }
});

// https://d1arch.wbc.vn/trang-chu/#wellcome
// https://d1arch.wbc.vn/trang-chu/#map
// https://d1arch.wbc.vn/trang-chu/#news
// https://d1arch.wbc.vn/trang-chu/#team
// https://d1arch.wbc.vn/trang-chu/#section-footer

