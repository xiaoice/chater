var mongodb = require('./db');
var moment = require('moment');


function User(user) {
	this.userId = user.userId;
	this.userName = user.userName;
	this.password=user.password;
	this.nickname=user.nickname;
	this.gender=user.gender;
	this.userImg=user.userImg;
	this.createTime=user.createTime;
	this.updateTime=user.updateTime;
	this.lastLoginTime=user.lastLoginTime;
	this.lastLoginIp=user.lastLoginIp;
	this.loginCount=user.loginCount;
	this.qqOpenId=user.qqOpenId;
};

module.exports = User;

//存储用户信息
User.prototype.insert = function(callback) {
	//要存入数据库的用户文档
	var user = {
		userId:this.userId
		,userName:this.userName
		,password:this.password
		,nickname:this.nickname
		,gender:this.gender
		,userImg:this.userImg
		,createTime:this.createTime||moment.format()
		,updateTime:this.updateTime
		,lastLoginTime:this.lastLoginTime
		,lastLoginIp:this.lastLoginIp
		,loginCount:this.loginCount
		,qqOpenId:this.qqOpenId
	};
	//打开数据库
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err); //错误，返回 err 信息
		}
		//读取 users 集合
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err); //错误，返回 err 信息
			}
			//将用户数据插入 users 集合
			collection.insert(user, {
				safe: true
			}, function(err, user) {
				mongodb.close();
				if (err) {
					return callback(err); //错误，返回 err 信息
				}
				callback(null, user[0]); //成功！err 为 null，并返回存储后的用户文档
			});
		});
	});
};

//根据条件获取用户信息 
User.get = function(wheres, callback) {
	wheres=wheres||{};
	//打开数据库
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err); //错误，返回 err 信息
		}
		//读取 users 集合
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err); //错误，返回 err 信息
			}
			//查找用户名（name键）值为 name 一个文档
			collection.findOne(wheres, function(err, user) {
				mongodb.close();
				if (err) {
					return callback(err); //失败！返回 err 信息
				}
				callback(null, user); //成功！返回查询的用户信息
			});
		});
	});
};

//根据userId获取用户信息
User.getByUserId = function(userId, callback) {
	User.get({
		userId:userId
	},callback)
};

//根据userId获取用户信息
User.getByUserId = function(userId, callback) {
	User.get({
		userId:userId
	},callback)
};

//根据qqOpenId获取用户信息
User.getByUserId = function(qqOpenId, callback) {
	User.get({
		qqOpenId:qqOpenId
	},callback)
};