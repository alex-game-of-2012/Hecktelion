#!/bin/env node
/* =========================================================================== */
/* BASIC PART								       */
/* =========================================================================== */

//	Init server global var
var url = require('url');
var querystring = require('querystring');

//	Init pages
var index = require('./page_index');
var notfound = require('./page_404');

//	Init scripts
var server = require('./script_server');
var db = require('./script_db');

//	Get network informations
var address  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || 8080;

/* =========================================================================== */
/* SERVER PART								       */
/* =========================================================================== */

var apollo1 = server.getServer;
server.configureServer(apollo1);

/* =========================================================================== */
/* DB PART								       */
/* =========================================================================== */

var soyouz11 = db.getConnection();

/* =========================================================================== */
/* ROUTES								       */
/* =========================================================================== */

//	Index page
apollo1.get('/', function (req, res) {
    index.display(req, res);
    res.end();
});

apollo1.get('/login', function (req, res) {
    console.log('Incoming login');
    var challenger = db.connectToDB(soyouz11, 'challenger');
    var users = db.getCollection(challenger, 'users');
    var param = querystring.parse(url.parse(req.url).query);
    var login = param['login'];
    var pwd = param['password'];
    console.log(login + ' : ' + pwd);
    challenger.close();
    res.end('OK');
});

//	404 page
apollo1.use(function (req, res, next) {
    notfound.display(res, res, next);
});

/* =========================================================================== */

//	Start server
apollo1.listen(port, address);
console.log("Server Apollo1 running at http://" + address + ":" + port + "/");
console.log("Connection to Soyouz11 established at " + soyouz11);
