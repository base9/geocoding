///////////////////////Environment settings/////////////////////////
// TODO: env settings in another file
// load api keys from local file when in local dev environment.
if(process.env.MODE !== 'prod'){
  require('../api_keys.js');
}
console.log('Running in >>>>>', process.env.MODE, 'mode');
 
// detect dev mode
// TODO: separate this to dev config
if (process.env.MODE !== 'prod' && process.env.MODE !== 'test') {
  process.env.MODE = 'dev';
}

console.log('Running in >>>>>', process.env.MODE, 'mode');
 
// assign ports for dev and test modes
var localPort = {
  dev: 9000,
  test: 9001
};
///////////////////////////////////////////////////////////////////////

// npm dependencies
var express  = require('express');

// file dependencies
var config = require('./config/middleware');
var router = require('./router');

var app = express();

// run app through config
config.express(app);

// use router for app
router(app);

// expose http wrapped app as server to enable closing the server programmatically 
var server = app.listen(process.env.PORT || localPort[process.env.MODE]);
console.log('app listening on port:' + (process.env.PORT || localPort[process.env.MODE]));


///////////////////////////////////////////////////////////////////////

// expose app and server
module.exports = {
  app: app,
};
if (server) {
  module.exports.server = server;
}
