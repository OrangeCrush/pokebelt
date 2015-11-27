var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var fs = require('fs');
var Pokemon = require('../models/Pokemon');
var Type = require('../models/Type');
var Nature = require('../models/Nature');

/*
 * Display the IVcalc page
 *
 * var ivc = new IvCalcView({
 *    el        : $('#app'),  // Required :: String :: Element to build in
 *    showRows  : 10          // Optional :: Int    :: Number of iv rows to show
 *    pokemon   : 'Pikachu'   // Optional :: String :: Pokemon to start with
 * });
 *
 * Only refresh the page on a data update event
 *
 */
var IvCalcView = Backbone.View.extend({
   initialize: function(opts){
      this.$el.html('');

      // No HP Fairy... 
      this.types = _.select(new Type({}).allTypes,function(type){
         return type !== "Fairy";
      });

      this.natures = new Nature({}).getAllNatures();
      this.pkmn = new Pokemon({
         id: Math.ceil((Math.random() * 718)),
         level: 50,
         nature: 'adamant',
      });

      this.pkmn.on('newPkmnData', this.render, this);
      this.pkmn.fetch();
   },

   IvCalcTemplate: _.template(fs.readFileSync(__dirname + '/../../templates/IvCalcTemplate.html', 'utf8')),

   events: {
     'keydown #pokemon'  : 'handleKeydown',
     'keydown #level'    : 'handleKeydown',
     'change  .resubmit' : 'updatePokemonName'
   },

   handleKeydown: function(e){
      var code = e.keycode || e.which;
      if(code == 13){
         this.updatePokemonName();
      }
   },

   /*
    * Events can call this to kick off a re-read and render
    */
   updatePokemonName: function(){
      if($('#pokemon').val()){
         this.pkmn.set('name', $('#pokemon').val());
         this.pkmn.set('id', '');
      }
      this.pkmn.fetch();
   },

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

   attachPkmnData: function(){
      if($('#level').val()){
         this.pkmn.set('level', parseInt($('#level').val()));
      }
      this.pkmn.set('hp_type', $('#hp-type').val());
      this.pkmn.set('characteristic', $('#char').val());
      this.pkmn.set('nature', $('#nature').val());
      this.pkmn.setNature();
      for(stat in this.pkmn.stats){
         var statName = 'ev_' + this.pkmn.stats[stat]
         var statVal = $('#ev-' + this.pkmn.stats[stat]).val() || 0;
         this.pkmn.set(statName, statVal);
      }
   },

   render: function(){
      this.attachPkmnData();
      this.calcIvTable();
      this.$el.html('');
      this.$el.append(this.IvCalcTemplate(this));
   }

});

module.exports = IvCalcView;
