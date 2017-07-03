var express = require('express');
var querystring = require('querystring');
var https = require("https");



var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test/:id',function(req,res,next){
	res.render("test",{output:req.params.id})
})

router.get('/login',function(req,res,next){
	res.send("Login");

	var req = https.request({
		hostname:'https://easytrades.herokuapp.com',
		rejectUnauthorized:false,
		port:'443',
		path:'/login',
		method:'POST',
		headers: {
    	'Content-Type': 'application/x-www-form-urlencoded'
}

	},function(res){

		res.once('data',function(data){

			console.log(data);

		});

	});

})



module.exports = router;
