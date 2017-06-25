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

/*
 * Convert 0.25 to 1/4 and 0.5 to 1/2
 */
String.prototype.toFraction = function(){
   var rval = this;
   switch(this){
      case '0.5' : rval = '1/2'; break;
      case '0.25': rval = '1/4'; break;
   }
   return rval.toString();
}

module.exports = {
   /*
    * Nicely decouple api calls and error handling with this
    * Cache api calls for 1 day
    */
   pokeapiCall: function(url, data, done){
      if(module.exports.localStorageSupport() && localStorage.getItem(url)){
        return $.Deferred().resolve(done(JSON.parse(localStorage.getItem(url)))).promise();
      }else{
         return $.ajax({
            url: 'https://pokeapi.co/'  + url,
            data: data
         }).done(function(results){
            if(module.exports.localStorageSupport()){
               localStorage.setItem(url, JSON.stringify(results));
            }
            done(results);
         });
      }
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
   },

   localStorageSupport: function(){
      try{
         localStorage.setItem('localStorage',true);
         localStorage.removeItem('localStorage');
         return true;
      }catch(e){
         return false;
      }
   },

};
