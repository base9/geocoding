var Bluebird = require('bluebird');
var request = Bluebird.promisify(require('request'));

//these variables are used by the throttler
var queue = [];
var isAsleep = true;
var interval = 250;


//geocoding request:
  //comes in as address string
  //goes out as lat and lng
function geocodeGoogleAPIRequest(req, clientRes){
  console.log('geocode request received!');
  if(!req.query.address){
    clientRes.status(400).end();
    return;
  }
  var addressString = req.query.address;
  var formattedAddress = addressString.split(' ').join('+');
  var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='; 
  var reqUrl =  apiUrl + formattedAddress + '&key=' + process.env.GOOGLE_GEOCODING_API_KEY;

  enqueueRequest(sendGeocodeRequest, req, reqUrl, clientRes);
}

//reverse geocoding request:
  //comes in as lat and lng
  //goes out as address object
function reverseGeocodeGoogleAPIRequest(req, clientRes){
  console.log('reverse geocode request received!');
  if(!(req.query.lat && req.query.lng)){
    clientRes.status(400).end();
    return;
  }
  var formattedCoords = req.query.lat+','+req.query.lng;
  var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
  var reqUrl =  apiUrl + formattedCoords + '&key=' + process.env.GOOGLE_GEOCODING_API_KEY;
  
  enqueueRequest(sendReverseGeocodeRequest, req, reqUrl, clientRes);
}


function sendGeocodeRequest(req, reqUrl, clientRes){
  request(reqUrl)
  .then(function(googleRes){
    if (googleRes.statusCode >= 400) {
      console.log(googleRes.statusCode + ' error on request to Geocoding API');
      clientRes.status(400).json('error on request to Geocoding API');
    } else {
      var json = JSON.parse(googleRes[0].body);
      if(json.results[0]){
        var lat = json.results[0].geometry.location.lat;
        var lng = json.results[0].geometry.location.lng;
        clientRes.status(200).json([lat,lng]);
      } else {
        console.log('Geocoding API did not return a lat/lng');
        clientRes.status(400).json('Geocoding API did not return a lat/lng');
      }
    }
  });
}

function sendReverseGeocodeRequest(req, reqUrl, clientRes){
  request(reqUrl)
  .then(function(googleRes){
    if (googleRes.statusCode >= 400) {
      console.log(googleRes.statusCode + ' error on request to Geocoding API');
      clientRes.status(400).json('error on request to Geocoding API');
    } else {
      var address = JSON.parse(googleRes[0].body).results[0].formatted_address;
      address = address.split(',');
      address[2] = address[2].split(' ');
      addressParams = {
        streetAddress1: address[0],
        city: address[1],
        state: address[2][1],
        zipCode: address[2][2],
        country: address[3]
      };   
      clientRes.status(200).json(addressParams);
    }
  });
}

function invokeFromQueue(){
  if(queue.length){
    isAsleep = false;
    var next = queue.shift();
    var fn = next[0];
    var args = next[1];
    fn.apply(null,args);
    setTimeout(invokeFromQueue,interval);
  } else {
    isAsleep = true;
  }
}

function enqueueRequest(fn){
  var args = Array.prototype.slice.call(arguments,1);
  queue.push([fn,args]);
  if(isAsleep){
    invokeFromQueue();
  }
};


module.exports = {
  geocode: geocodeGoogleAPIRequest,
  reverseGeocode: reverseGeocodeGoogleAPIRequest
};
