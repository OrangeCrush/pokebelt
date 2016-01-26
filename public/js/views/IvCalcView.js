var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var fs = require('fs');
var Pokemon = require('../models/Pokemon');
var Type = require('../models/Type');
var Nature = require('../models/Nature');
var Characteristic = require('../models/Characteristic');
var Type = require('../models/Type');
var utils = require('../utils');

/*
 * Display the IVcalc page
 *
 * var ivc = new IvCalcView({
 *    el        : $('#app'),  // Required :: String :: Element to build in
 *    showRows  : 10          // Optional :: Int    :: Number of iv rows to show
 *    pkmnid    : 25          // Optional :: Int    :: Pokemon ID to start with. Takes precedence over pkmnname
 *    pkmnname  : 'Pikachu'   // Optional :: String :: Pokemon to start with
 * });
 *
 * Only refresh the page on a data update event
 * Changing a pokemon's name passes control to the router
 *
 */
var IvCalcView = Backbone.View.extend({
   initialize: function(opts){
      var self = this;
      utils.updateActiveNav(0);

      /*
       * Get a list of all Pokemon in the database
       */
      Pokemon.GetAllPokemonNames(function(pokemon){
         self.pokemon = pokemon;
      })

      /*
       * Get a list of all natures in the database
       */
      Nature.GetAllNatures(function(natures){
         self.natures = natures;
      });

      /*
       * Get a list of all the characteristics in the database
       */
      Characteristic.GetAllCharacteristics(function(characteristics){
         self.characteristics = characteristics;
      });

      this.pkmn = new Pokemon({
         id             : opts.pkmnid, 
         name           : opts.pkmnname,
         level          : 50,
         nature         : 'adamant',
         characteristic : 'A little quick tempered'
      });

      // On these fields changing, re-render the view
      this.pkmn.on('change:level',  this.render, this);
      this.pkmn.on('change:ev_hp',  this.render, this);
      this.pkmn.on('change:ev_atk', this.render, this);
      this.pkmn.on('change:ev_def', this.render, this);
      this.pkmn.on('change:ev_spa', this.render, this);
      this.pkmn.on('change:ev_spd', this.render, this);
      this.pkmn.on('change:ev_spe', this.render, this);
      this.pkmn.on('newPkmnData',   this.render, this);

      this.pkmn.characteristic.on('newCharacteristicData', this.render, this);
      this.pkmn.nature.on('newNatureData',                 this.render, this);
      this.pkmn.on('newPkmnStatData',                      this.render, this);

      this.pkmn.fetch();
   },

   IvCalcTemplate: _.template(fs.readFileSync(__dirname + '/../../templates/IvCalcTemplate.html', 'utf8')),

   /*
    * Set the appropriate data when form fields change
    */
   events: {
     'keydown #pokemon'  : 'handleKeydown',
     'change  .resubmit' : 'updateData',
   },

   /*
    * Fire on any change event from .resubmit elements.
    * Update the "data-stat" value to the val of the element.
    * Cast anything to an integer that looks like one
    *
    * Handle special cases (nature, characteristic) first
    */
   updateData: function(e){
      this.pkmn.set($(e.target).data('attr'), parseInt($(e.target).val()) || $(e.target).val());
   },

   /*
    * Set the according element on the model,
    * and add a history event to the router.
    */
   handleKeydown: function(e){
      var code = e.keycode || e.which;
      if(code == 13){
         e.preventDefault();
         Backbone.history.navigate('/ivcalc/' + $('#pokemon').val());
         this.pkmn.set('id', null);
         this.pkmn.set('name', $('#pokemon').val());
      }
   },

   /*
    * Calculate the IV table for each IV value
    */
   calcIvTable: function(e){
      this.ivTable = [];
      // Calc status at each IV, store in a table
      for(var i = 0; i < 32; i++){
         for(stat in this.pkmn.stats){
            // We don't want to trigger a change with this set
            this.pkmn.set('iv_' + this.pkmn.stats[stat], 31 - i, { silent: true });
         }
         this.pkmn.resolveAllStats();
         this.ivTable.push([
            this.pkmn.get('hp'),
            this.pkmn.get('atk'),
            this.pkmn.get('def'),
            this.pkmn.get('spa'),
            this.pkmn.get('spd'),
            this.pkmn.get('spe')
         ]);
      }

      //Store the strikeouts as boolean from the characteristic in a paralell table 
      this.charTable = [];
      if(this.pkmn.get('characteristic') != ''){
         for(var i = 0; i < 32; i++){
            this.charTable.push([])
            for(var stat in this.pkmn.stats){
               if(this.pkmn.characteristic.get('ivs').indexOf(i) != -1 && this.pkmn.stats[stat] == this.pkmn.characteristic.get('stat')){
                  this.charTable[i].push(true)
               }else{
                  this.charTable[i].push(false);
               }
            }
         }
      }
   },

   /*
    * 1) calculate the iv table
    * 2) Clear whatever is in #app
    * 3) Append the newly generated html to app
    *
    * Only called on a newPkmnData event from Pokemon.js
    * or a change to any ".resubmit" element
    */
   render: function(){
      this.calcIvTable();
      this.$el.html('');
      this.$el.append(this.IvCalcTemplate(this));
   }
});

module.exports = IvCalcView;
