'use strict';


var kraken = require('kraken-js'),
    app = require('express')(),
    nconf = require('nconf'),
    options = require('./lib/spec')(app),
    db = require ('./lib/database'),
    port = process.env.PORT || 8000;

    nconf.argv().env().file('config/config.json');
    db.config(nconf.get('databaseConfig'));

    app.use(kraken(options));

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
