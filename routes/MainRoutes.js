var express = require('express');
var router = express.Router();
var DataManager = require('../controllers/DataManager');
var exports = module.exports = {};
var io = require('socket.io');
var request = require('request');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res) {
  res.render('index', { username: req.user.username });
  console.log(req.user.username);
});

function ensureAuthenticated(req, res, next) { //Middleware
  if (req.isAuthenticated()) {
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect('/users/login');
  }
}

exports.router = router;

exports.socketFunction = function(server) {
  console.log("Socket Listuener active");
  io = io(server);
  io.on('connection', (socket) => {

    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });


    //socket.on('search', test.searchFunct(query));
    //In sequence diagram we don't know who the callback function( function(query) ) belongs to
    socket.on('search', function(query) { //event 2

      var formattedQuery = '';
      var queryTerms = query.split(" ");
      for (i = 0; i < queryTerms.length; i++) {
        formattedQuery = formattedQuery + "\"" + queryTerms[i] + "\" ";
      }
      DataManager.getHotspotByName(formattedQuery, function(err, results) {

        if (err)
          throw err;
        else{
          console.log(results);
          io.emit('searchResults', results);
        }
      });
    });

    socket.on('reqCarparkInfo', function(location) { //event 2
      getCarParkInfo(location);

    });

    socket.on('checkCrowdLvl', function(location) { //event 3
      getCrowdLvl(location);

    });

  });
}

getCarParkInfo = function(location){

  var options = { url: 'http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailability',
  headers: {
      'AccountKey': 'kkcDGM/9R/aHrR1zQythEQ=='
    }
  };

  request(options, function(err, res, json) {
  if (err) {
    throw err;
  }
  var nearbyCarparks = getNearbyCarparks(JSON.parse(json), location);
  io.emit('nearbyCarparks', nearbyCarparks);
  });

}

getNearbyCarparks = function(data, location){
  var carparks = {carparks: []};
  for(i = 0; i < data.value.length; i++){
    if(getDistance(data.value[i].Latitude, data.value[i].Longitude, location.lat, location.lon) < 1)
      carparks.carparks.push(data.value[i]);
  }
  return carparks;

}

function getDistance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function getCrowdLvl(location){
  var localPythonServerUrl = 'http://localhost:5000/populartimes?lat=' + location.lat + '&lon=' + location.lon;
  var options = { url: localPythonServerUrl};

  request(options, function(err, res, json) {
  if (err) {
    throw err;
  }

  console.log(JSON.parse(json));
  io.emit('crowdLvl', JSON.parse(json));
  });

}

//Hotspot feedback
router.post('/feedback',ensureAuthenticated, function(req, res){

   console.log(req.user.username + " submited a feedback");

   var id = req.body.hotspotid;
   console.log(id);

   DataManager.getHotspotById(id, function (err, doc) {

     if(doc.flagList === null){//empty flaglist
       doc.flagList = [req.user.username];//Need to declare flaglist as array as it is initial declared as null in db
       doc.save();
       req.flash('success_msg', 'Feedback submitted! Please proceed to select other location!');
       res.redirect('/');
     }else{//not empty
       if(doc.flagList.indexOf(req.user.username) == -1){//check if current user already flag the hotspot before
         doc.flagList.push(req.user.username);
         doc.save();
         req.flash('success_msg', 'Feedback submitted! Please proceed to select other location!');
         res.redirect('/');
       }else{
         req.flash('error_msg', 'You have already flag this location before! You are only allowed to flag a location once.');
         res.redirect('/');
       }
     }

   })



});
