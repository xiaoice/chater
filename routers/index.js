var express = require('express');
var router = express.Router();
var result = require('../models/result');
var users = require('../models/users');


//主模块，判断是否登录
router.get('/', function (req, res) {
  	if (!req.session.user) {
    	return res.redirect('/login.html');
	}else{
		return res.redirect('/list.html');
	}
});


//登录系统
router.post('/login.do', function (req, res) {
	var params=req.body;
	var user={
		openId:params.openId
		,nickname:params.nickname
		,gender:params.gender
		,figureurl:params.figureurl
		,figureurl_1:params.figureurl_1
		,figureurl_2:params.figureurl_2
		,figureurl_qq_1:params.figureurl_qq_1
		,figureurl_qq_2:params.figureurl_qq_2
		,province:params.province
		,city:params.city
	}
	req.session.user=user;
	req.session.save();
	res.json(result.ok(req.session.user));
});

//退出登录
router.get('/loginOut.do', function (req, res) {
	if(req.session.user){
		var user=JSON.parse(JSON.stringify(req.session.user));
		req.session.destroy(function(err) {
			res.json(result.ok(user));
		})
	}
});

//注册用户
router.post('/reg.do', function (req, res) {
	var params=req.body;
	var _params={
		openId:params.openId
		,nickname:params.nickname
		,gender:params.gender
		,figureurl:params.figureurl
		,figureurl_1:params.figureurl_1
		,figureurl_2:params.figureurl_2
		,figureurl_qq_1:params.figureurl_qq_1
		,figureurl_qq_2:params.figureurl_qq_2
		,province:params.province
		,city:params.city
	}

	var user = new User({
		nickname: req.body.nickname,
		userName: req.body.userName,
		gender: req.body.gender,
		password: req.body.password
	});

	//检查用户名是否已经存在
	User.get(newUser.name, function(err, user) {
		if (user) {
			console.log('error', '用户已存在!');
			//return res.redirect('/reg'); //返回注册页
		}
		//如果不存在则新增用户
		newUser.save(function(err, user) {
			if (err) {
				req.flash('error', err);
				//return res.redirect('/reg'); //注册失败返回主册页
			}
			//req.session.user = user; //用户信息存入 session
			console.log(user);
			//console.log(req.session.user);
			console.log('success', '注册成功!');
		});
	});
	req.session.user=user;
	req.session.save();
	res.json(result.ok(req.session.user));
});

router.get('/login.html', function (req, res) {

	/*//检查用户名是否已经存在
	var newUser = new User({
		name: "test",
		password: 123456
	});
	User.get(newUser.name, function(err, user) {
		if (user) {
			console.log('error', '用户已存在!');
			//return res.redirect('/reg'); //返回注册页
		}
		//如果不存在则新增用户
		newUser.save(function(err, user) {
			if (err) {
				req.flash('error', err);
				//return res.redirect('/reg'); //注册失败返回主册页
			}
			//req.session.user = user; //用户信息存入 session
			console.log(user);
			//console.log(req.session.user);
			console.log('success', '注册成功!');
		});
	});*/


	if (req.session.user) {
		if(req.query.type==="loginOut"){
			res.render('login');
		}else{
    		res.render('list',JSON.parse(JSON.stringify(req.session.user)));
		}
	}else{
		res.render('login');
	}
});

router.get('/reg.html', function (req, res) {
    res.render('reg',req.session.user);
});

//监听是否登录-session
router.use(function(req, res, next){
  res.locals.user = req.session.user;
  if (!req.session.user) {
  	return res.redirect('/login.html');
  }
  //console.log('%s %s', req.method, req.url);
  next();
});

router.get('/list.html', function (req, res) {
    res.render('list',JSON.parse(JSON.stringify(req.session.user)));
});

router.get('/chaters.html', function (req, res) {
    res.render('chaters',JSON.parse(JSON.stringify(req.session.user)));
});

module.exports = router;