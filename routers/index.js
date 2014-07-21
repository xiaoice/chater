var express = require('express');
var router = express.Router();


//主模块，判断是否登录
router.get('/', function (req, res) {
	console.log(app.session);
  	if (!req.session) {
    	return res.redirect('/login.html');
	}else{
		return res.redirect('/list.html');
	}
});

router.post('/login.do', function (req, res) {
	console.log(req,req.body,req.params);
    //res.render('login');
});

router.get('/login.html', function (req, res) {
    res.render('login');
});

//监听是否登录-session
router.use(function(req, res, next){
  res.locals.user = req.session.user;
  if (!req.session.user) {
      return res.redirect('/login.html');
  }
  console.log('%s %s', req.method, req.url);
  next();
});


router.get('/reg.html', function (req, res) {
    res.render('reg');
});

router.get('/list.html', function (req, res) {
    res.render('list');
});

router.get('/chaters.html', function (req, res) {
    res.render('chaters');
});


module.exports = router;