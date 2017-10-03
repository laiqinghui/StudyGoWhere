var express = require('express');
var router = express.Router();
var DataManager = require('../controllers/DataManager');
var exports = module.exports = {};
var io = require('socket.io');

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
  });
}
