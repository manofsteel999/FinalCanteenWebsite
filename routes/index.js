var express = require('express');
var router = express.Router();

var fs = require('fs');
var passport=require('passport');
var Cart = require('../models/cart');
var products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
var User = require("../models/user")
router.get('/landing', function (req, res, next) {
  var productId = products && products[0].id;

  res.render('index', 
  { 
    title: 'Canteen Order Cart',
    products: products
  }
  );
});

router.get('/', function(req, res) {
  res.render('landing');
});

router.get('/mech', function(req, res) {
  res.render('mech');
});
router.get('/csit', function(req, res) {
  res.render('csit');
});



router.get('/add/:id', function(req, res, next) {

  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var product = products.filter(function(item) {
    return item.id == productId;
  });
  cart.add(product[0], productId);
  req.session.cart = cart;
  res.render('landing');
  inline();
});

router.get('/cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', {
      products: null
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('cart', {
    title: 'Canteen Order Cart',
    products: cart.getItems(),
    totalPrice: cart.totalPrice
  });
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/user/signup', function(req,res,next){
  
  res.render('user/signup');
})

// If signup is success we get directed to profile.hbs
 //router.post('/user/signup', passport.authenticate('local.signup', {
 //successRedirect: '/user/profile',
  //failureRedirect: '/user/signup',
  //failureFlash: true 
  
 //}) );
router.post('/user/signup', function(req,res){
  var newUser= new User({username:req.body.username});
  User.register(newUser,req.body.password,function(err, user){
    if(err){
      console.log(err);
      return res.render('user/signup');
    }
    passport.authenticate('local')(req,res,function() {
      res.render('/user/profile');
    })
  });
});

router.get('/user/profile', function(req,res,next){
  res.render('user/profile');
});



module.exports = router;
