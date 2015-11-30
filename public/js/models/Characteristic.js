var Backbone = require('backbone');
var $ = require('jquery');
var utils = require('../utils');

/*
 * Encapsulate a Pokemon characteristic 
 *
 * var myChar = new Constructor({
 *    name: "Likes to thrash about"
 * });
 *
 */
var CharacteristicModel = Backbone.Model.extend({
   initialize: function(opts){
      if(!opts){
         throw "Constructor args can not be null.";
      }else if(opts.name){
         var chars = this.CharacteristicData.map(function(characteristic){
            return opts.name.toLowerCase() == characteristic.name.toLowerCase();
         });

         // Set data if a valid characteristic was found
         // Do not throw an exception so that other
         // methods about characteristics can still be used
         if(chars.length == 1){
            self.set('name', chars[0].name);
            self.set('stat', chars[0].stat);
            self.set('ivs',  chars[0].ivs);
         }
      }
   },

   idAttribute : 'name',
},{
// Class data
   GetAllCharacteristics: function(){
      return this.CharacteristicData.map(function(x){
         return x.name;
      });
   },

   /*
    * pokeapi does not serve characteristic data so
    * once again I find myself mindlessly hard coding this
    */
   CharacteristicData:[
      {
         "stat":"hp",
         "name":"Loves to eat",
         "ivs":[0, 5, 10, 15, 20, 25, 30]
      },
      {
         "stat":"hp",
         "name":"Takes plenty of siestas",
         "ivs":[1, 6, 11, 16, 21, 26, 31]
      },
      {
         "stat":"hp",
         "name":"Nods off a lot",
         "ivs":[2, 7, 12, 17, 22, 27]
      },
      {
         "stat":"hp",
         "name":"Scatters things often",
         "ivs":[3, 8, 13, 18, 23, 28]
      },
      {
         "stat":"hp",
         "name":"Likes to relax",
         "ivs":[4, 9, 14, 19, 24, 29]
      },
      {
         "stat":"atk",
         "name":"Proud of its power",
         "ivs":[0, 5, 10, 15, 20, 25, 30]
      },
      {
         "stat":"atk",
         "name":"Likes to thrash about",
         "ivs":[1, 6, 11, 16, 21, 26, 31]
      },
      {
         "stat":"atk",
         "name":"A little quick tempered",
         "ivs":[2, 7, 12, 17, 22, 27]
      },
      {
         "stat":"atk",
         "name":"Likes to fight",
         "ivs":[3, 8, 13, 18, 23, 28]
      },
      {
         "stat":"atk",
         "name":"Quick tempered",
         "ivs":[4, 9, 14, 19, 24, 29]
      },
      {
         "stat":"def",
         "name":"Sturdy body",
         "ivs":[0, 5, 10, 15, 20, 25, 30]
      },
      {
         "stat":"def",
         "name":"Capable of taking hits",
         "ivs":[1, 6, 11, 16, 21, 26, 31]
      },
      {
         "stat":"def",
         "name":"Highly persistent",
         "ivs":[2, 7, 12, 17, 22, 27]
      },
      {
         "stat":"def",
         "name":"Good endurance",
         "ivs":[3, 8, 13, 18, 23, 28]
      },
      {
         "stat":"def",
         "name":"Good perserverance",
         "ivs":[4, 9, 14, 19, 24, 29]
      },
      {
         "stat":"spa",
         "name":"Highly curious",
         "ivs":[0, 5, 10, 15, 20, 25, 30]
      },
      {
         "stat":"spa",
         "name":"Mischievous",
         "ivs":[1, 6, 11, 16, 21, 26, 31]
      },
      {
         "stat":"spa",
         "name":"Thoroughly cunning",
         "ivs":[2, 7, 12, 17, 22, 27]
      },
      {
         "stat":"spa",
         "name":"Often lost in thought",
         "ivs":[3, 8, 13, 18, 23, 28]
      },
      {
         "stat":"spa",
         "name":"Very finicky",
         "ivs":[4, 9, 14, 19, 24, 29]
      },
      {
         "stat":"spd",
         "name":"Strong willed",
         "ivs":[0, 5, 10, 15, 20, 25, 30]
      },
      {
         "stat":"spd",
         "name":"Somewhat vain",
         "ivs":[1, 6, 11, 16, 21, 26, 31]
      },
      {
         "stat":"spd",
         "name":"Strongly defiant",
         "ivs":[2, 7, 12, 17, 22, 27]
      },
      {
         "stat":"spd",
         "name":"Hates to lose",
         "ivs":[3, 8, 13, 18, 23, 28]
      },
      {
         "stat":"spd",
         "name":"Somewhat stubborn",
         "ivs":[4, 9, 14, 19, 24, 29]
      },
      {
         "stat":"spe",
         "name":"Likes to run",
         "ivs":[0, 5, 10, 15, 20, 25, 30]
      },
      {
         "stat":"spe",
         "name":"Alert to sounds",
         "ivs":[1, 6, 11, 16, 21, 26, 31]
      },
      {
         "stat":"spe",
         "name":"Impetuous and silly",
         "ivs":[2, 7, 12, 17, 22, 27]
      },
      {
         "stat":"spe",
         "name":"Somewhat of a clown",
         "ivs":[3, 8, 13, 18, 23, 28]
      },
      {
         "stat":"spe",
         "name":"Quick to flee",
         "ivs":[4, 9, 14, 19, 24, 29]
      },
   ]
})

module.exports = CharacteristicModel;
