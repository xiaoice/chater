var _ = require('../../util/underscore');


//user实体类
var __user = {
	userId:undefined
	,username:undefined
	,password:undefined
	,nickname:undefined
	,gender:undefined
	,userImg:undefined
	,userSex:undefined
	,createTime:undefined
	,updateTime:undefined
	,lastLoginTime:undefined
	,lastLoginIp:undefined
	,loginCount:undefined
	,qqOpenId:undefined
};

function User(user) {
	user=_.extend(__user,user||{});
	this.userId = user.userId;
	this.username = user.username;
	this.password=user.password;
	this.nickname=user.nickname;
	this.gender=user.gender;
	this.userImg=user.userImg;
	this.userSex=user.userSex;
	this.createTime=user.createTime;
	this.updateTime=user.updateTime;
	this.lastLoginTime=user.lastLoginTime;
	this.lastLoginIp=user.lastLoginIp;
	this.loginCount=user.loginCount;
	this.qqOpenId=user.qqOpenId;
};

module.exports = User;