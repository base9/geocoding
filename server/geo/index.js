var controller = require('./geo.controller');
var router = require('express').Router();
var auth = require('./../../auth/auth.service');

router.get('/geocode', controller.doTheThing);

router.get('/reverseGeocode', controller.doTheOtherThing);

module.exports = router;
