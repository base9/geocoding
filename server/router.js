var express     = require('express');
var geoRouter   = require('./geo');

module.exports = function (app, passport) {
  // router
  app.use('/geo', geoRouter);

};