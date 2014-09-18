var moment = require('moment');
var userModel = require('../models/userModel');
var mongodb = require('../models/db');
var _mongodb=new require('mongodb');


function userService(user){
	this.user=new userModel(user||{});
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
userService.prototype.findOne = function(wheres, callback) {
	wheres=wheres||{};
	if(typeof wheres._id!=="undefined"){
		wheres._id=_mongodb.ObjectID(wheres._id);
	}

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

//根据条件获取用户信息
userService.prototype.find = function(wheres, callback) {
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
			//,'_id,username,nickname,userImg,createTime'
			collection.find(wheres).toArray(function(err, users) {
				mongodb.close();
				if (err) {
					return callback(err); //失败！返回 err 信息
				}
				callback(null, users); //成功！返回查询的用户信息
			});
		});
	});
};

//根据条件删除用户信息
userService.prototype.remove = function(wheres, callback) {
	wheres=wheres||{};
	if(typeof wheres._id!=="undefined"){
		wheres._id=_mongodb.ObjectID(wheres._id);
	}
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
			//,'_id,username,nickname,userImg,createTime'
			collection.remove(wheres, function(err, user) {
				mongodb.close();
				if (err) {
					return callback(err); //失败！返回 err 信息
				}
				callback(null); //成功！返回查询的用户信息
			});
		});
	});
};

module.exports=userService;