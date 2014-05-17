'use strict';


var kraken = require('kraken-js'),
    app = require('express')(),
    nconf = require('nconf'),
    options = require('./lib/spec')(app),
    db = require ('./lib/database'),
    passport = require ('passport'),
    auth = require('./lib/auth'),
    //User = require('./models/User'),
    port = process.env.PORT || 8000;

    nconf.argv().env().file('config/config.json');
    db.config(nconf.get('databaseConfig'));

    passport.use(auth.localStrategy());

    //Give passport a way to serialize and deserialize a user. In this case, by the user's id.
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({_id: id}, function (err, user) {
            done(null, user);
        });
    });

    app.use(kraken(options));

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
