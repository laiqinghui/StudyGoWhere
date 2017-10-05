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

    socket.on('reqCarparkInfo', function(query) { //event 2
      getCarParkInfo(query);

    });


  });
}

getCarParkInfo = function(){

  var options = { url: 'http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailability',
  headers: {
      'AccountKey': 'kkcDGM/9R/aHrR1zQythEQ=='
    }
  };

  request(options, function(err, res, json) {
  if (err) {
    throw err;
  }
  console.log(json);
  });

}

filterRelatedCarpark = function(data){



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
