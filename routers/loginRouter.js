var express = require('express');
var router = express.Router();
var result = require('../util/result');
var userService = require('../controller/service/userService');


//登录系统
router.post('/login.do', function (req, res) {
	var userModel = {
		username: req.body.username
		,password: req.body.password
	};

	if(userModel.username===""){
		return res.json(result.error("用户名不能为空"));
	}else if(userModel.password===""){
		return res.json(result.error("密码不能为空"));
	}else{
		_userService=new userService(userModel);

		//检查用户名是否已经存在
		_userService.findOne(userModel, function(err, user) {
			if (user) {
				req.session.user=user;
				req.session.save();
				return res.json(result.ok("登录成功！",req.session.user));
			}else{
				return res.json(result.error("登录失败，用户名或者密码错误"));
			}
		});
	}
});

//注销
router.get('/loginOut.do', function (req, res) {
	if(req.session.user){
		var user=JSON.parse(JSON.stringify(req.session.user));
		req.session.destroy(function(err) {
			return res.json(result.ok("注销成功"));
		})
	}else{
		return res.json(result.error("注销失败"));
	}
});


//注册用户
router.post('/reg.do', function (req, res) {
	var userModel = {
		username: req.body.username
		,password: req.body.password
		,nickname: req.body.nickname
	};
	_userService=new userService(userModel);

	//检查用户名是否已经存在
	_userService.findOne({username:userModel.username}, function(err, user) {
		if (user) {
			return res.json(result.error("用户名已经存在"));
		}else{
			//如果不存在则新增用户
			_userService.insert(function(err, user) {
				if (err) {
					return res.json(result.error(err));
				}else{
					req.session.user=user;
					req.session.save();
					res.json(result.ok("注册成功！",req.session.user));
				}
			});
		}
	});
});


//获取所有用户列表
router.get('/list.do', function (req, res) {
	_userService=new userService();
	//检查用户名是否已经存在
	_userService.find({},function(err, users) {
		if (err) {
			return res.json(result.error(err));
		}else{
			return res.json(result.ok(users));
		}
	});
});

router.get('/login.html', function (req, res) {
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

//主模块，判断是否登录
router.get('/', function (req, res) {
  	if (!req.session.user) {
    	return res.redirect('/login.html');
	}else{
		return res.redirect('/list.html');
	}
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
	console.log(JSON.parse(JSON.stringify(req.session.user)));
    res.render('chaters',JSON.parse(JSON.stringify(req.session.user)));
});

module.exports = router;