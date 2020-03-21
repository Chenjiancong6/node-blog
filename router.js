var express = require("express");
var User = require("./models/user.js"); //引用数据库
var md5 = require("blueimp-md5");
var router = express.Router();

router.get("/", function (req, res) {
  res.render("index.html", {
    user: req.session.user //保存登录状态（重要！没有显示不了个人信息）
  });
});

router.get("/login", function (req, res) {
  res.render("login.html");
});

/**
 * 登录post请求
 */
router.post("/login", function (req, res) {
  // 1. 获取表单数据
  var body = req.body;

  // 2. 查询数据库用户名密码是否正确
  User.findOne({
      //查询的内容
      email: body.email,
      password: md5(md5(body.password))
    },
    function (err, user) {
      //user:上面查询的账号和密码

      // 3. 发送响应数据
      //如果发生错误，返回500
      if (err) {
        return res.status(500).json({
          err_code: 500, //网络错误
          message: err.message
        });
      }
      //如果查询的信息和数据库不匹配
      if (!user) {
        return res.status(200).json({
          err_code: 1, //信息不匹配
          message: "邮箱或者密码错误"
        });
      }

      // 用户存在，登陆成功，通过 Session 记录登陆状态
      req.session.user = user;

      //如果用户存在，登录成功
      return res.status(200).json({
        err_code: 0, // 信息匹配成功
        message: "登录成功"
      });
    }
  );
});

router.get("/register", function (req, res) {
  res.render("register.html");
});

/**
 * 注册post请求
 */
router.post("/register", function (req, res) {
  //1. 获取表单内容 :req.body
  var body = req.body;

  //2. 查询数据库用户是否存在
  User.findOne({
      $or: [
        //$or 方法查询是否有一个满足条件
        {
          email: body.email
        },
        {
          nickname: body.nickname
        }
      ]
    },
    function (err, data) {
      // 3. 发送响应数据
      //如果发生错误，返回500
      if (err) {
        return res.status(500).json({
          err_code: 500,
          message: "服务端错误"
        });
      }
      //账号或者昵称已经存在
      if (data) {
        return res.status(200).json({
          err_code: 1,
          message: "邮箱或者密码已经存在"
        });
      }

      //账号或者昵称都不存在，
      //创建一个新的，并保存在数据库

      // 对密码进行 md5 重复加密
      body.password = md5(md5(body.password));

      new User(body).save(function (err, user) {
        if (err) {
          return res.status(500).json({
            err_code: 500,
            message: "网络错误"
          });
        }

        // 注册成功，使用 Session 记录用户的登陆状态
        req.session.user = user;

        //注册成功
        res.status(200).json({
          err_code: 0,
          message: "ok"
        });
      });
    }
  );
});

/**
 * 清除登录状态
 */

router.get("/logout", function (req, res) {
  //清除登录状态
  req.session = null;

  //重定向到首页
  res.redirect("/login");
});

/**
 * 发起
 */
router.get("/topic/new", function (req, res) {
  res.render("topic/new.html");
});

/**
 * 设置
 */
router.get("/settings/profile", function (req, res) {
  res.render("settings/profile.html");
});

/**
 * 个人主页
 */
router.get("/topic/show", function (req, res) {
  res.render("topic/show.html");
});


module.exports = router;