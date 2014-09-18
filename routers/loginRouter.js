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
			return res.redirect("login.html");
		})
	}
});


//注册用户
router.post('/reg.do', function (req, res) {
	var userModel = {
		username: req.body.username
		,password: req.body.password
		,nickname: req.body.nickname
		,userImg: req.body.userImg
		,userSex: req.body.userSex
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
	var username=req.query.username;
	_userService=new userService();
	var para={};
	if(username!==""){
		para.username=new RegExp(username);
	}
	//检查用户名是否已经存在
	_userService.find(para,function(err, users) {
		if (err) {
			return res.json(result.error(err));
		}else{
			return res.json(result.ok(users));
		}
	});
});

//根据用户ID删除用户信息
router.get('/deleteById.do', function (req, res) {
	var _id=req.query._id;
	_userService=new userService();
	//检查用户名是否已经存在
	_userService.remove({_id:_id},function(err) {
		if (err) {
			return res.json(result.error(err));
		}else{
			return res.json(result.ok("删除成功！"));
		}
	});
});

router.get('/login.html', function (req, res) {
	if (req.session.user) {
		if(req.query.type==="loginOut"){
			res.render('login');
		}else{
			res.redirect('userList.html');
    		//res.render('userList',JSON.parse(JSON.stringify(req.session.user)));
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
		return res.redirect('/userList.html');
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

router.get('/userList.html', function (req, res) {
	_userService=new userService();
	//检查用户名是否已经存在
	_userService.find({'_id':{$ne:new require('mongodb').ObjectID(req.session.user._id)}},function(err, users) {
		if (err) {
			res.redirect(404);
		}else{
		    res.render('userList',{
		    	userinfo:req.session.user
		    	,users:users
		    });
		}
	});

});

router.get('/chat.html', function (req, res) {
	_userService=new userService();
	  //检查用户名是否已经存在
	  //new require('mongodb').ObjectID(req.query.targetId)
	_userService.findOne({_id:req.query.targetId}, function(err, user) {
	    if (user) {
	    	res.render('chat',{
		    	user:JSON.parse(JSON.stringify(req.session.user))
		    	,target:{
		    		_id:user._id
		    		,username:user.username
		    		,nickname:user.nickname
		    		,userImg:user.userImg||''
		    	}
		    });
	    }else{
	    	console.log(req.query.targetId,user);
	    }
	});
});

router.get('/search.html', function (req, res) {
	res.render('search');
});

module.exports = router;