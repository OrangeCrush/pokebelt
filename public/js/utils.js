/*
 * Extend any protoypes (IE) string or write uselful functions here
 */
var $ = require('jquery');

String.prototype.capitalize = function(){
   if(this.length == 0){
      return this;
   }else{
      return this[0].toUpperCase() + this.split('').splice(1,this.length).join('');
   }
}

module.exports = {
   /*
    * Nicely decouple api calls anmd error handling with this
    */
   pokeapiCall: function(url, data, done){
      host = window.location.hostname;
      return $.ajax({
         url: 'http://' + host + ':8000/' + url,
         data: data
      }).done(function(results){
         done(results)
      }).error(function(err){
         throw "Error in pokeapiCall - " + err;
      });
   },

   /*
    * Highlight the tabs on the top of the page
    *
    * tab :: Int :: Optional :: 0 based index of the tab to highlight.  Not passing leaves them blank
    */
   updateActiveNav: function(tab){
      var tabs = $('ul.navbar-nav > li')
      for(var i = 0; i < tabs.length; i++ ){
         $(tabs[i]).removeClass('active');
      }
      if(parseInt(tab) >= 0){
         $(tabs[tab]).addClass('active');
      }
   },

   /*
    * Capitalize the pokemon names...
    * gengar-mega        -> Gengar-Mega
    * charizard-mega-x   -> Charizard-Mega-X
    * vaporeon           -> Vaporeon
    */
   capitalizePkmn: function(name){
      return name.split('-').map(function(nm){
         return nm.capitalize();
      }).join('-');
   }

};
