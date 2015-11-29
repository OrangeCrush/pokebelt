var $ = require('jquery');

module.exports = {
   /*
    * Nicely decouple api calls anmd error handling with this
    */
   pokeapiCall: function(url, done){
      host = window.location.hostname;
      $.ajax({
         url: 'http://' + host + ':8000/' + url
      }).done(function(results){
         done(results)
      }).error(function(err){
         throw "Error in pokeapiCall - " + err;
      });
   },

   /*
    * Highlight the tabs on the top of the page
    *
    * tab :: Int :: 0 based index of the tab to highlight
    */
   updateActiveNav: function(tab){
      var tabs = $('ul.navbar-nav > li')
      for(var i = 0; i < tabs.length; i++ ){
         $(tabs[i]).removeClass('active');
      }
      $(tabs[tab]).addClass('active');
   }

};
