//requirements up here



//geocoding request:
  //comes in as address string
  //goes out as lat and lng
function geocodeGoogleAPIRequest(addressString){
  var formattedAddress = addressString.split(' ').join('+');
  var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='; 
  var reqUrl =  apiUrl + formattedAddress + '&key=' + process.env.GOOGLE_GEOCODING_API_KEY;
  return request(reqUrl);
}


function getCoordinatesFromGoogleAPIResponse(res){
  if (res.statusCode >= 400) {
    console.log(res.statusCode + ' error on request to Geocoding API');
  } else {
    var json = JSON.parse(res[0].body);
    if(json.results[0]){
      var lat = json.results[0].geometry.location.lat;
      var lng = json.results[0].geometry.location.lng;
      return [lat,lng];
    }
    return [0,0];
  }
}


//reverse geocoding request:
  //comes in as lat and lng
  //goes out as address object



function reverseGeocodeGoogleAPIRequest(coords){
  var formattedCoords = coords.lat+','+coords.lng;
  var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
  var reqUrl =  apiUrl + formattedCoords + '&key=' + process.env.GOOGLE_GEOCODING_API_KEY;
  console.log("REQUEST URL: ", reqUrl);
  return request(reqUrl);
}

function parseGoogleAPIAddress(res){
  if (res.statusCode >= 400) {
    console.log(res.statusCode + ' error on request to Geocoding API');
  } else {
    var address = JSON.parse(res[0].body).results[0].formatted_address;
    address = address.split(',');
    address[2] = address[2].split(' ');
    addressParams = {
      streetAddress1: address[0],
      city: address[1],
      state: address[2][1],
      zipCode: address[2][2],
      country: address[3]
    };   
    return addressParams;
  }
}