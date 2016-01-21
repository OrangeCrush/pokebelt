var Backbone = require('backbone');
var $ = require('jquery');
var utils = require('../utils');
var _ = require('underscore');

/*
 * Encapsulate a pokemon type
 *
 *
 * var nature = new Nature({
 *    name : 'adamant'
 * });
 * 
 */
var NatureModel = Backbone.Model.extend({
   idAttribute: 'name',

   initialize: function(opts){
      var self = this;
      if(!opts){
         throw "Constructor args can not be null";
      }else if(opts.name){
         self.set('name', opts.name.toLowerCase())
      }
   },

   sync: function(method,model){
      switch(method){
         case 'read': this.getNature(); break;
      }
   },

   getNature: function(){
      var self = this;
      var url = 'api/v2/nature/' + self.get('name') + '/';
      return utils.pokeapiCall(url, {}, function(results){
         for(key in results){
            self.set(key, results[key], {silent: true});
         }
         self.normalizeMod();
         self.trigger('newNatureData');
      });
   },

   normalizeMod: function(){
      var stats = {
         hp:  'hp',
         atk: 'attack',
         def: 'defense',
         spa: 'special-attack',
         spd: 'special-defense',
         spe: 'speed'
      };
      for(var stat in stats){
         if(this.get('decreased_stat') && this.get('decreased_stat').name == stats[stat]){
            this.set(stat, 0.9);
         }else if(this.get('increased_stat') && this.get('increased_stat').name == stats[stat]){
            this.set(stat, 1.1);
         }else{
            this.set(stat, 1);
         }
      }
   },

   getModForStat: function(stat){
      return this.get(stat.toLowerCase());
   }
},{
   GetAllNatures: function(next){
      return utils.pokeapiCall('api/v2/nature/', {
         'limit' : 9999
      },function(results){
         next(results.results.map(function(nature){
            return nature.name;
         }));
      });
   }
});

module.exports = NatureModel;
