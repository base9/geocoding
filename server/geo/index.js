var controller = require('./geo.controller');
var router = require('express').Router();

router.get('/geocode', controller.geocode);

router.get('/reverseGeocode', controller.reverseGeocode);

module.exports = router;
