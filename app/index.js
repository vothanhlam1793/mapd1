const express = require("express"); 
var logger = require('morgan')
const app = express();
const path = require('path')

function middle(keystone, dev, distDir){
  app.use(logger('dev'));
  app.set('views', __dirname + "/views");
  app.set('view engine', 'ejs')
  app.use(express.static(path.join(__dirname,'public')))
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // TOOL
  app.get("/", (req, res)=>{
      res.render("index");
  })
  return app;
}

module.exports.middle = middle;