var Bluebird = require('bluebird');
var request = Bluebird.promisify(require('request'));


//geocoding request:
  //comes in as address string
  //goes out as lat and lng
function geocodeGoogleAPIRequest(req, clientRes){
  console.log('geocode request received!');
  var addressString = req.query.address;
  var formattedAddress = addressString.split(' ').join('+');
  var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='; 
  var reqUrl =  apiUrl + formattedAddress + '&key=' + process.env.GOOGLE_GEOCODING_API_KEY;
  
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
      }
      console.log('Geocoding API did not return a lat/lng');
      clientRes.status(400).json('Geocoding API did not return a lat/lng');
    }
  });
}



//reverse geocoding request:
  //comes in as lat and lng
  //goes out as address object



function reverseGeocodeGoogleAPIRequest(req, clientRes){
  console.log('reverse geocode request received!');
  var formattedCoords = req.query.lat+','+req.query.lng;
  var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
  var reqUrl =  apiUrl + formattedCoords + '&key=' + process.env.GOOGLE_GEOCODING_API_KEY;
  return request(reqUrl)
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




module.exports = {
  geocode: geocodeGoogleAPIRequest,
  reverseGeocode: reverseGeocodeGoogleAPIRequest
}
