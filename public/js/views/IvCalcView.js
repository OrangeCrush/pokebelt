var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var fs = require('fs');
var Pokemon = require('../models/Pokemon');
var Type = require('../models/Type');
var Nature = require('../models/Nature');
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
      utils.updateActiveNav(0);
      this.natures = new Nature({}).getAllNatures();

      this.pkmn = new Pokemon({
         id     : opts.pkmnid, 
         name   : opts.pkmnname,
         level  : 50,
         nature : 'adamant',
      });

      this.pkmn.on('newPkmnData', this.render, this);
      this.pkmn.fetch();
   },

   IvCalcTemplate: _.template(fs.readFileSync(__dirname + '/../../templates/IvCalcTemplate.html', 'utf8')),

   events: {
     'keydown #pokemon'  : 'handleKeydown',
     'change  .resubmit' : 'render'
   },

   /*
    * Renavigate the page if a new pokemon is entered
    */
   handleKeydown: function(e){
      var code = e.keycode || e.which;
      if(code == 13){
         e.preventDefault();
         Backbone.history.navigate('/ivcalc/' + $('#pokemon').val(), true);
      }
   },

   /*
    * Calucalte the IV table for each IV value
    */
   calcIvTable: function(e){
      this.ivTable = [];
      // Calc status at each IV, store in a table
      for(var i = 0; i < 32; i++){
         for(stat in this.pkmn.stats){
            this.pkmn.set('iv_' + this.pkmn.stats[stat], 31 - i);
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
   },

   /*
    * Attach data in the form the the backbon model
    * before running any math
    */
   attachPkmnData: function(){
      if($('#level').val()){
         this.pkmn.set('level', parseInt($('#level').val()));
      }
      this.pkmn.set('nature', $('#nature').val());
      this.pkmn.setNature();
      for(stat in this.pkmn.stats){
         var statName = 'ev_' + this.pkmn.stats[stat]
         var statVal = $('#ev-' + this.pkmn.stats[stat]).val() || 0;
         this.pkmn.set(statName, statVal);
      }
   },

   /*
    * 1) Attach the data from the form to the modle
    * 2) calculate the iv table
    * 3) Clear whatever is in #app
    * 4) Append the newly generated html to app
    *
    * Only called on a newPkmnData event from Pokemon.js
    * or a change to any ".resubmit" element
    */
   render: function(){
      this.attachPkmnData();
      this.calcIvTable();
      this.$el.html('');
      this.$el.append(this.IvCalcTemplate(this));
   }

});

module.exports = IvCalcView;
