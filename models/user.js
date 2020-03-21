/**
 * 用户的数据模型，限制用户的输入，并保存在数据库中
 */

//导入
var mongoose = require("mongoose");

//// 指定连接的数据库不需要存在，当你插入第一条数据之后就会自动被创建出来
mongoose.connect("mongodb://localhost/CongBlog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once("open", () => {
  console.log("连接数据库成功.");
});

//文档结构
var Schema = mongoose.Schema;

userSchema = new Schema({
  //登录账号
  email: {
    type: String,
    require: true
  },
  //昵称
  nickname: {
    type: String,
    require: true
  },
  //登录密码
  password: {
    type: String,
    require: true
  },
  //创建时间
  created_time: {
    type: Date,
    default: Date.now
  },
  //修改时间
  last_modified_time: {
    type: Date,
    default: Date.now
  },
  //头像
  avatar: {
    type: String,
    default: "/public/img/avatar-default.png"
  },
  //个人介绍
  bio: {
    type: String,
    default: ""
  },
  //性别
  gender: {
    type: Number,
    enum: [-1, 0, 1], //-1:保密，0：男
    default: -1
  },
  //出生
  birthday: {
    type: Date
  },
  //登录权限
  status: {
    type: Number,
    // 0 没有权限限制
    // 1 不可以评论
    // 2 不可以登录
    enum: [0, 1, 2],
    default: 0
  }
});

//发布
module.exports = mongoose.model("User", userSchema);
