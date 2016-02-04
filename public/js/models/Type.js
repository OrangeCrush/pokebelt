var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var utils = require('../utils');

/*
 * Encapsulate a pokemon type
 *
 *
 * var types = new Type({
 *    name  : 'fire'
 * });
 * 
 */
var TypeModel = Backbone.Model.extend({
   idAttribute: 'name',

   initialize: function(opts){
      _.extend(this,opts);
   },

   sync: function(method,model){
      switch(method){
         case 'read': return this.getType();
      }
   },

   getType: function(){
      var self = this;
      var url = "api/v2/type/" + self.get('name').toLowerCase() + '/';
      return utils.pokeapiCall(url, {}, function(results){
         for(key in results){
            self.set(key, results[key]);
         }
         self.trigger('newTypeData');
      });
   },

   /*
    * Get the damage mod when this type attacks the passed type
    */
   getAtkMod: function(type){
      var mod = 1;
      var mods = this.get('damage_relations')
      if(!mods || mods.no_damage_to.map(function(x){ return x.name }).indexOf(type) != -1){
         mod = 0;
      }else if(mods.half_damage_to.map(function(x){ return x.name }).indexOf(type) != -1){
         mod = 0.5;
      }else if(mods.double_damage_to.map(function(x){ return x.name }).indexOf(type) != -1){
         mod = 2;
      }
      return mod;
   },

   /*
    * Get the damage mod when this type defends agaisnt the passed type
    */
   getDefMod: function(type){
      var mod = 1;
      var mods = this.get('damage_relations')
      if(!mods || mods.no_damage_from.map(function(x){ return x.name }).indexOf(type) != -1){
         mod = 0;
      }else if(mods.half_damage_from.map(function(x){ return x.name }).indexOf(type) != -1){
         mod = 0.5;
      }else if(mods.double_damage_from.map(function(x){ return x.name }).indexOf(type) != -1){
         mod = 2;
      }
      return mod;
   }

},{
   GetAllTypeNames: function(next){
      utils.pokeapiCall('api/v2/type/',{
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
