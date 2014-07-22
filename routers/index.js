var express = require('express');
var router = express.Router();
var result = require('./result');

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

//监听是否登录-session
router.use(function(req, res, next){
  res.locals.user = req.session.user;
  if (!req.session.user) {
  	return res.redirect('/login.html');
  }
  //console.log('%s %s', req.method, req.url);
  next();
});

router.get('/reg.html', function (req, res) {
    res.render('reg',req.session.user);
});

router.get('/list.html', function (req, res) {
    res.render('list',JSON.parse(JSON.stringify(req.session.user)));
});

router.get('/chaters.html', function (req, res) {
    res.render('chaters',JSON.parse(JSON.stringify(req.session.user)));
});

module.exports = router;