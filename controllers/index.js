'use strict';

var LoginModel = require('../models/login');
var IndexModel = require('../models/index');
var passport = require('passport');

module.exports = function (router) {

    var model = new IndexModel();

    router.get('/', function (req, res) {
        res.render('index', model);
    });

    router.get('/login', function (req, res) {
	model.messages = req.flash('error');
        res.render('login/index', model);
    });

    router.post('/login', function(req, res) {

        passport.authenticate('local', {
		successRedirect: req.session.goingTo || '/profile',
		failureRedirect: '/login',
		failureFlash: true
	})(req, res);

    });

};
