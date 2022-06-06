const express = require("express"); 
var logger = require('morgan')
const app = express();
const path = require('path')
var cookieParser = require('cookie-parser');

function middle(keystone, dev, distDir){
  app.use(logger('dev'));
  app.set('views', __dirname + "/views");
  app.set('view engine', 'ejs')
  app.use(express.static(path.join(__dirname,'public')))
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // TOOL
  app.get("/", (req, res)=>{
      res.render("index");
  });

  // Trang nhap lieu
  app.get("/input", (req, res)=>{
    res.render("input/index");
  });
  return app;
}

module.exports.middle = middle;