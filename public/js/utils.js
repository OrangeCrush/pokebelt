var $ = require('jquery');

module.exports = {
   /*
    * Nicely decouple api calls anmd error handling with this
    */
   pokeapiCall: function(url, done){
      $.ajax({
         url: 'http://localhost:8000/' + url
      }).done(function(results){
         done(results)
      }).error(function(err){
         throw "Error in pokeapiCall - " + err;
      });
   }

};
