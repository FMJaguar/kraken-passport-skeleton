'use strict';


var AdminModel = require('../../models/admin'),
	auth = require('../../lib/auth');


module.exports = function (router) {

    var model = new AdminModel();

    router.get('/', auth.isAuthenticated('admin') ,function (req, res) {
        res.render('admin/index', model);
    });

};
