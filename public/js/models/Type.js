var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var utils = require('../utils');
var TypeMods = require('../data/type_mods');
var Types = require('../data/types');

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
      return;
   },

   /*
    * Get the damage mod when this type attacks the passed type
    */
   getAtkMod: function(type){
      var self = this;
      return TypeMods.data.filter(function(x){
         return x.attacking == self.get('name').toLowerCase() && type.toLowerCase() == x.defending;
      })[0].factor;
   },

   /*
    * Get the damage mod when this type defends agaisnt the passed type
    */
   getDefMod: function(type){
      var self = this;
      return TypeMods.data.filter(function(x){
         return x.defending == self.get('name').toLowerCase() && type.toLowerCase() == x.attacking;
      })[0].factor;
   }

},{
   GetAllTypeNames: function(next){
      next(Types.data.map(function(x){
         return x.capitalize();
      }).sort());
   }
});

module.exports = TypeModel;
