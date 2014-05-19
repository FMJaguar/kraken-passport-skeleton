'use strict';

var kraken = require('kraken-js'),
    app = require('express')(),
    nconf = require('nconf'),
    options = require('./lib/spec')(app),
    db = require ('./lib/database'),
    auth = require('./lib/auth'),
    flash = require('connect-flash'),
    passport = require ('passport'),
    User = require('./models/user'),
    port = process.env.PORT || 8000;

    nconf.argv().env().file('config/config.json');
    db.config(nconf.get('databaseConfig'));

    app.use(flash());                //Use flash for saving/retrieving error messages for the user

    app.on('middleware:after:session', function configPassport(eventargs) {
        passport.use(auth.localStrategy());
	passport.serializeUser(function (user, done) {
		//we cannot edit users yet so nothing to do here
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findOne({_id: id}, function (err, user) {
		done(null, user);
		});
	});
        app.use(passport.initialize());
        app.use(passport.session());
    	app.use(auth.injectUser);        //Inject the authenticated user into the response context
    });


//Add two users to the system.
var u1 = new User({
    name: 'Kraken McSquid',
    login: 'kraken',
    password: 'releaseMe',
    role: 'admin'
});

var u2 = new User({
    name: 'Ash Williams',
    login: 'awilliams',
    password: 'boomstick',
    role: 'user'
});

//Ignore errors. In this case, the errors will be for duplicate keys as we run this app more than once.
u1.save();
u2.save();
    
app.use(kraken(options));

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
