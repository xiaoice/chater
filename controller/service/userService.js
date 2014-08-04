var moment = require('moment');
var userModel = require('../models/userModel');
var mongodb = require('../models/db');


function userService(user){
	this.user=new userModel(user);
}

//存储用户信息
userService.prototype.insert = function(callback) {
	var user=this.user;
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
userService.prototype.get = function(wheres, callback) {
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
userService.getByUserId = function(userId, callback) {
	userService.get({
		userId:userId
	},callback)
};

//根据userId获取用户信息
userService.getByUserName = function(userId, callback) {
	userService.get({
		userName:userName
	},callback)
};

//根据qqOpenId获取用户信息
userService.getByUserOpenId = function(qqOpenId, callback) {
	userService.get({
		qqOpenId:qqOpenId
	},callback)
};

module.exports=userService;