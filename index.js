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

    passport.use(auth.localStrategy());

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({_id: id}, function (err, user) {
            done(null, user);
        });
    });

    app.use(kraken(options));
    app.use(flash());                //Use flash for saving/retrieving error messages for the user
    app.use(passport.initialize());  //Use Passport for authentication
    app.use(passport.session());     //Persist the user in the session
    app.use(auth.injectUser);        //Inject the authenticated user into the response context

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
