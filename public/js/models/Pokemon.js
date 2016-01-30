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
 * Events:
 *    newPkmnData : Trigger when ALL resources are finished fetching for this Pokemon
 *
 * SubModels:
 *    this.get('nature') // Name of the nature
 *    this.nature        // Points to Nature model instance, updated on change:nature
 * 
 *    this.get('characteristic') // Name of the characteristic
 *    this.characteristic        // Points to Characteristic model instance, updated on change:characteristic
 */
var PokemonModel = Backbone.Model.extend({
   idAttribute: 'id',

   /*
    * All these attributes will be copied over
    */
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

   /*
    * See above for constructor usage
    */
   initialize: function(opts){
      var self = this;

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

      this.nature = new Nature({
         name: self.get('nature')
      });

      this.characteristic = new Characteristic({
         name: self.get('characteristic')
      });

      this.on('change:nature',         this.getNatureForPokemon, this);
      this.on('change:characteristic', this.getCharacteristicForPokemon, this);
      this.on('change:name',           this.getPokemonByName, this);
      this.on('change:id',             this.getPokemonById, this);
   
   },

   /*
    * Override backbones Model#fetch method
    *
    * Get all of the data that could be attached to this pokemon
    */
   sync: function(method){
      switch(method){
         case 'read': 
            this.getAllPokemonData();
      }
   },

   /*
    * Make api calls to get characteristic data, nature data, and pokemon data
    *
    * When these delegate, resolve all stats on the pokemon and fire the newPkmnData event.
    */
   getAllPokemonData: function(){
      var self = this;

      // Supress sub model events
      self.set('trigger',                false);
      self.nature.set('trigger',         false);
      self.characteristic.set('trigger', false);

      // This is async for now (no API call inmplemented in pokeapi)
      self.getCharacteristicForPokemon();
      $.when(self.getPokemon(), self.getNatureForPokemon()).done(function(){
         self.resolveAllStats();

         // Re-enable submodel triggers
         self.set('trigger',                true);
         self.nature.set('trigger',         true);
         self.characteristic.set('trigger', true);

         self.trigger('newPkmnData');
      });
   },

   /*
    * GET /api/v2/pokemon/(id|name)
    * id has precedence over name if you call this funciton by itself.
    *
    * If you want to grab data by setting name or id, call the other methods below
    */
   getPokemon: function(key){
      var self = this;
      var url = 'api/v2/pokemon/' + (key || self.get('id') || self.get('name').toLowerCase()) + '/';
      return utils.pokeapiCall(url, {}, function(results){
         for(key in results){
            self.set(key, results[key], {silent: true});
         }
         if(self.get('trigger')){
            self.trigger('newPkmnStatData');
         }
      });
   },

   /*
    * Wrapper to force refreshing by name
    */
   getPokemonByName: function(){
      this.getPokemon(this.get('name'))
   },

   /*
    * Wrapper to force refreshing by Id
    */
   getPokemonById: function(){
      this.getPokemonById(this.get('id'));
   },

   /*
    * Get the nature data for the pokemon by calling Nature#fetch
    *
    * 'nature' needs to be set to something
    */
   getNatureForPokemon: function(){
      this.nature.set('name', this.get('nature'))
      return this.nature.fetch();
   },

   /*
    * Get the characteristic data for the pokemon by calling Characteristic#fetch
    */
   getCharacteristicForPokemon: function(){
      this.characteristic.set('name', this.get('characteristic'))
      return this.characteristic.fetch();
   },

   /*
    * Return the base stat for this pokemon that was passed
    */
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

   /*
    * Calcualte the passed stat for this Pokemon
    */
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

   /*
    * Calculate actual stats from ev's / iv's / nature / level / base stats
    */
   resolveAllStats: function(trigger){
      for(stat in this.stats){
         this.set(this.stats[stat], this.resolveStat(this.stats[stat]),{silent: !trigger});
      }
   }

},{
   GetAllPokemonNames: function(next){
      utils.pokeapiCall('api/v2/pokemon', {
         'limit': 9999
      },function(results){
         next(results.results.map(function(pkmn){
            return utils.capitalizePkmn(pkmn.name);
         }));
      });
   }
});

module.exports = PokemonModel;
