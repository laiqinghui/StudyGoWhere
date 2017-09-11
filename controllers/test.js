module.export = function searchFunct(query) { //event 2

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
      io.emit('test', results);
    }
  });
};
