var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var utils = require('../utils');
var Nature = require('./Nature');
var Characteristic = require('./Characteristic');
var Move = require('./Move');
var Pokedex = require('../data/pokedex');
var Learnset = require('../data/learnset');
var Moves = require('../data/moves');

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
   idAttribute: 'name',

   stats: ['hp','atk','def','spa','spd','spe'],

   /*
    * See above for constructor usage
    */
   initialize: function(opts){
      var self = this;

      _.extend(this, opts)
      this.set('trigger', true);

      if(!this.get('name')){
         throw "Must specify name or id when creating a Pokemon";
      }

      this.nature = new Nature({
         name: self.get('nature') || ''
      });

      this.characteristic = new Characteristic({
         name: self.get('characteristic') || ''
      });

      this.moves = [];
      for(var i = 0; i < 4; i++){
         this.moves.push(new Move({
            name: self.get('move' + (i + 1)) || '' 
         }));
      }

      this.on('change:nature',         this.getNatureForPokemon, this);
      this.on('change:characteristic', this.getCharacteristicForPokemon, this);
      this.on('change:name',           this.getPokemon, this);
      this.on('change:move1',          function(){ return this.getMove(1) }, this);
      this.on('change:move2',          function(){ return this.getMove(2) }, this);
      this.on('change:move3',          function(){ return this.getMove(3) }, this);
      this.on('change:move4',          function(){ return this.getMove(4) }, this);

   },

   /*
    * Override backbones Model#fetch method
    *
    * Get all of the data that could be attached to this pokemon
    */
   sync: function(method){
      switch(method){
         case 'read': 
            return this.getAllPokemonData();
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
      for(var i = 0; i < 4; i++){
         self.moves[i].set('trigger', false)
      }

      $.when( self.getPokemon(), 
              self.getMove(1),
              self.getMove(2),
              self.getMove(3),
              self.getMove(4),
              self.getCharacteristicForPokemon(),
              self.getNatureForPokemon()
            ).done(function(){
         self.resolveAllStats();

         // Re-enable submodel triggers
         self.set('trigger',                true);
         self.nature.set('trigger',         true);
         self.characteristic.set('trigger', true);
         for(var i = 0; i < 4; i++){
            self.moves[i].set('trigger', true)
         }

         self.trigger('newPkmnData');
      });
   },

   /*
    * Return a promise that the move data for move[1234] will
    * be returned.  Returns true if the backbone variables for
    * move[1234] are not set
    */
   getMove: function(moveNum){
      var promise = true;
      if(this.get('move' + moveNum)){
         this.moves[moveNum - 1].set('name', this.get('move' + moveNum));
         promise = this.moves[moveNum - 1].fetch();
      }
      return promise;
   },

   /*
    * GET /api/v2/pokemon/(id|name)
    * id has precedence over name if you call this function by itself.
    *
    * If you want to grab data by setting name or id, call the other methods below
    */
   getPokemon: function(){
      var self = this;
      var pkmn_key;
      var pkmn = Object.keys(Pokedex.data).map(function(x){
         return Pokedex.data[x];
      }).filter(function(x){
         if(self.get('name')){
            return x.species.toLowerCase() == self.get('name').toLowerCase();
         }else{
            throw "No name or id passed or set to get pokemon information";
         }
      })[0];

      // Copy all attributes from the dex onto this object
      for(i in pkmn){
         this.set(i, pkmn[i], {silent: true});
      }

      if(this.get('trigger')){
         this.trigger('newPkmnStatData');
      }

   },

   /*
    * Get the nature data for the pokemon by calling Nature#fetch
    */
   getNatureForPokemon: function(){
      var promise = true;
      if(this.get('nature')){
         this.nature.set('name', this.get('nature'));
         promise = this.nature.fetch();
      }
      return promise;
   },

   /*
    * Get the characteristic data for the pokemon by calling Characteristic#fetch
    */
   getCharacteristicForPokemon: function(){
      var promise = true;
      if(this.get('characteristic')){
         this.characteristic.set('name', this.get('characteristic'));
         promise = this.characteristic.fetch();
      }
      return promise;
   },

   /*
    * Return the base stat for this pokemon that was passed
    */
   getBaseStat: function(stat){
      return this.get('baseStats')[stat];
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
   },

   /*
    * Return array of move names this pokemon can learn
    */
   getAvailableMoveNames: function(){
      var self = this;
      var pkmn_key = Object.keys(Pokedex.data).filter(function(x){
         return Pokedex.data[x].species == self.get('name');
      })[0]; //TODO deal with forms

      var move_keys = Object.keys(Learnset.data[pkmn_key].learnset);
      return move_keys.map(function(x){
         return Moves.data[x].name;
      });
   }

},{
   GetAllPokemonNames: function(next){
      var names = Object.keys(Pokedex.data).filter(function(x){
         return Pokedex.data[x].num > 0;
      }).map(function(x){
         return Pokedex.data[x].species;
      });
      if(next) {
         next(names);
      }
      return names;
   },
   GetRandomPokemon: function(){
      var mons = PokemonModel.GetAllPokemonNames();
      return mons[Math.floor(Math.random() * mons.length)];
   }
});

module.exports = PokemonModel;
