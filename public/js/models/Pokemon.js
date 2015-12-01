var Backbone = require('backbone');
var $ = require('jquery');
var utils = require('../utils');
var Nature = require('./Nature');
var Characteristic = require('./Characteristic');

/*
 * Encapsulate a single Pokemon.
 *
 * Be able to calculate "effective" stats after copying over the
 * static values from the api.
 *
 * Not many of the values are required
 *
 * Accept the following fields in the constructor to be copied over to the object.
 * var pika = new Pokemon({
 *    name:   'Pikachu', // Required :: String :: The Pokemon to instantiate 
 *
 *    iv_hp:  31,  // Optional :: Int :: HP  individual value
 *    iv_atk: 12,  // Optional :: Int :: ATK individual value
 *    iv_def: 16,  // Optional :: Int :: DEF individual value
 *    iv_spa: 29,  // Optional :: Int :: SPA individual value
 *    iv_spd: 21,  // Optional :: Int :: SPD individual value
 *    iv_spe: 31,  // Optional :: Int :: SPE individual value
 *
 *    ev_hp:  6,   // Optional :: Int :: HP  effort value
 *    ev_atk: 0,   // Optional :: Int :: ATK effort value
 *    ev_def: 0,   // Optional :: Int :: DEF effort value
 *    ev_spa: 252, // Optional :: Int :: SPA effort value
 *    ev_spd: 0,   // Optional :: Int :: SPD effort value
 *    ev_spe: 252, // Optional :: Int :: SPE effort value
 *
 *    nature : 'timid'                          // Optional :: String :: Pokemon Nature
 *    level  : 100                              // Optional :: Int :: Pokemon level
 *    characteristic  : 'Likes to thrash about' // Optional :: String :: Pokemon characteristic
 *
 * });
 * 
 */
var PokemonModel = Backbone.Model.extend({
   idAttribute: 'id',
   constructor_attrs: [
      'ev_hp',  
      'ev_atk', 
      'ev_def', 
      'ev_spa', 
      'ev_spd', 
      'ev_spe', 
      'iv_hp',  
      'iv_atk', 
      'iv_def', 
      'iv_spa', 
      'iv_spd', 
      'iv_spe',
      'level',
      'nature',
      'characteristic'
   ],

   stats: ['hp','atk','def','spa','spd','spe'],

   initialize: function(opts){
      if(opts.name){
         this.set('name', opts.name.toLowerCase());
      }
      if(opts.id){
         this.set('id', opts.id);
      }
      if(!(this.get('name') || this.get('id'))){
         throw "Must specify name or id when creating a Pokemon";
      }

      for(var attr in this.constructor_attrs){
         this.set(this.constructor_attrs[attr], opts[this.constructor_attrs[attr]]);
      }
      this.setNature();
      this.setCharacteristic();
   },

   sync: function(method,model){
      switch(method){
         case 'read': this.getPokemon(); break;
      }
   },

   getPokemon: function(){
      var self = this;
      var url = 'api/v2/pokemon/' + (self.get('id') || self.get('name').toLowerCase());
      utils.pokeapiCall(url, {}, function(results){
         for(key in results){
            self.set(key, results[key]);
         }
         self.resolveAllStats();
         self.trigger('newPkmnData');
      });
   },

   getBaseStat: function(stat){
      return this.get('stats')[{
         'hp' : 0,
         'atk': 1,
         'def': 2,
         'spa': 3,
         'spd': 4,
         'spe': 5
      }[stat.toLowerCase()]].base_stat;
   },

   resolveStat: function(stat){
      stat = stat.toLowerCase();
      if(stat == "hp"){
         return Math.floor(((2 * this.getBaseStat('hp') + (this.get('iv_hp') || 0) + Math.floor((this.get('ev_hp') || 0) / 4)) * this.get('level')) / 100) + this.get('level') + 10;
      }else{
         var b  = this.getBaseStat(stat);
         var iv = this.get('iv_' + stat) || 0;
         var ev = this.get('ev_' + stat) || 0;
         return Math.floor((Math.floor((iv + 2 * b + ev / 4) * this.get('level') / 100) + 5) * this.nature.getModForStat(stat));
      }
   },

   resolveAllStats: function(){
      for(stat in this.stats){
         this.set(this.stats[stat], this.resolveStat(this.stats[stat]));
      }
   },

   setNature: function(){
      if(this.get('nature')){
         this.nature = new Nature({
            name: this.get('nature')
         });
      }
   },

   setCharacteristic: function(){
      if(this.get('characteristic')){
         this.characteristic = new Characteristic({
            name: this.get('characteristic') 
         });
      }
   }
});

module.exports = PokemonModel;
