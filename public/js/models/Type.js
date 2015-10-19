var Backbone = require('backbone');
var $ = require('jquery');
var utils = require('../utils');

/*
 * Encapsulate a pokemon type
 *
 *
 * var types = new Type({
 *    name : 'fire'
 * });
 * 
 */
var TypeModel = Backbone.Model.extend({
   idAttribute: 'name',

   initialize: function(opts){
      if(!opts){
         throw "Constructor args can not be null";
      }else if(opts.name){
         self.set('name', opts.name)
      }
   },

   sync: function(method,model){
      switch(method){
         case 'read': this.getType(); break;
      }
   },

   getType: function(){
      var self = this;
      var url = "api/v2/type/" + self.get('name');
      utils.pokeapiCall(url, function(results){
         for(key in results){
            self.set(key, results[key]);
         }
      });
      self.trigger('newTypeData');
   },

   allTypes: [
     'Normal',
     'Fighting',
     'Flying',
     'Poison',
     'Ground',
     'Rock',
     'Bug',
     'Ghost',
     'Steel',
     'Fire',
     'Water',
     'Grass',
     'Electric',
     'Psychic',
     'Ice',
     'Dragon',
     'Dark',
     'Fairy'
   ]
});

module.exports = TypeModel;
