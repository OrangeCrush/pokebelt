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
      utils.pokeapiCall(url, {}, function(results){
         for(key in results){
            self.set(key, results[key]);
         }
      });
      self.trigger('newTypeData');
   },

},{
   GetAllTypeNames: function(next){
      utils.pokeapiCall('api/v2/type',{
         'limit': 9999
      },function(results){
         next(results.results.map(function(type){
            return type.name;
         }).sort().filter(function(name){
            return name.toLowerCase() != 'shadow' && name.toLowerCase() != 'unknown';
         }));
      });
   }
});

module.exports = TypeModel;
