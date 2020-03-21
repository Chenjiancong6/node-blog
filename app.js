//导入express框架
var express = require("express");
var path = require("path");
var session = require("express-session"); //保持登录状态
var bodyParser = require("body-parser");
var router = require("./router");
//引用框架
const app = express();
//访问静态资源，公开指定目录，开放指定资源 app.use()

app.use("/public/", express.static(path.join(__dirname, "./public/")));
app.use(
  "/node_modules/",
  express.static(path.join(__dirname, "./node_modules/"))
);
// app.use(
//   "/views/topic/new",
//   express.static(path.join(__dirname, "./views/topic/"))
// );

//配置模板引擎
app.engine("html", require("express-art-template"));
app.set("views", path.join(__dirname, "./views/")); // 默认就是 ./views 目录

//配置post 表单
//var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: false
}));
//把字符串转换为对象
app.use(bodyParser.json());

app.use(
  session({
    // secret: "itcast":配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: "itcast",
    resave: false,
    saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
  })
);

//把路由容器挂载到app 服务中 (要放到代码的后面)
app.use(router);

//启动服务
app.listen(4000, function () {
  console.log("服务器已经开启，端口是:http://127.0.0.1:4000");
});