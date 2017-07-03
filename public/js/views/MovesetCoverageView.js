var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var fs = require('fs');
var DropDownView = require('./DropDownView');
var Pokemon = require('../models/Pokemon');
var Type = require('../models/Type');
var Move = require('../models/Move');
var utils = require('../utils');

/*
 * Display a Moveset Coverage Tool
 */
var MovesetCoverageView = Backbone.View.extend({

   initialize: function(opts){
      var self = this;
      utils.updateActiveNav(1);
      this.types = [];

      // The familiar this.pkmn PokemonModel
      //
      // Store move names as a .set
      // Store move objects as .move[1234]
      //
      this.pkmn = new Pokemon({
         name : opts.pkmnname
      });

      for(var i = 0; i < 4; i++){
         this.pkmn.moves[i].on('newMoveData', this.render, this);
      }
      this.pkmn.on('newPkmnStatData', this.setDefaultMoves, this);
      this.pkmn.on('newPkmnStatData', this.render, this);
      this.pkmn.on('newPkmnData',     this.render, this);

      this.pkmn.getPokemon();
      this.setDefaultMoves();

      // Pokemon name dropdown
      this.pkmnDropDown = new DropDownView({
         src     : Pokemon.GetAllPokemonNames,
         id      : 'pokemon',
         el      : '#pkmndd',
         classes : 'form-control resubmit', 
         label   : 'Pokemon',
         sorted  : true,
         data : {
            attr: 'pokemon'
         }
      });
      this.pkmnDropDown.refresh();
      this.pkmnDropDown.on('newDropDownData', this.pkmnDropDown.render, this.pkmnDropDown);

      //Make 4 move dropdowns
      this.moveDropDowns = [];
      for(var i = 0; i < 4; i++){
         this.moveDropDowns.push(new DropDownView({
            src     : self.pkmn.getAvailableMoveNames(),
            id      : 'move' + (i + 1),
            el      : '#move' + (i + 1) + 'dd' ,
            classes : 'form-control resubmit', 
            label   : 'Move' + (i + 1),
            sorted  : true,
            data: {
               attr: 'move' + (i + 1)
            }
         }));
         this.moveDropDowns[i].refresh();
         this.moveDropDowns[i].on('newDropDownData', this.moveDropDowns[i].render, this.moveDropDowns[i]);
      }

      // Get all of the type names and data
      this.typeModels        = [];
      this.typeModelPromises = [];

      Type.GetAllTypeNames(function(types){
         self.types = types;
         //
         //Get all of the type data
         for(var i = 0; i < self.types.length; i++){
            self.typeModels.push(new Type({
               name: self.types[i]
            }));
            self.typeModelPromises.push(self.typeModels[i].fetch());
         }
         $.when.apply($, self.typeModelPromises).done(function(){
            self.render();
         });
      });
   },

   MovesetCoverageTemplate: _.template(fs.readFileSync(__dirname + '/../../templates/MovesetCoverageTemplate.html', 'utf8')),

   events:{
      'change .resubmit' : 'updateModels',
   },

   /*
    * Handle UI events for changing pokemon or moves
    */
   updateModels: function(e){
      var self = this;
      if($(e.target).data('attr') == 'pokemon'){
         this.pkmn.set('name', $(e.target).val());
         Backbone.history.navigate('/movecov/' + $('#pokemon').val());
      }else{
         this.pkmn.set($(e.target).data('attr'), $(e.target).val());
      }
   },

   /*
    * Render the move drop downs with this function
    */
   renderMoves: function(){
      for(var i = 0; this.moveDropDowns && i < 4; i++){
         this.moveDropDowns[i].src      = this.pkmn.getAvailableMoveNames();
         this.moveDropDowns[i].selected = this.pkmn.get('move' + (i + 1)) || '';
         this.moveDropDowns[i].refresh().setElement('#move' + (i + 1) + 'dd').render();
      }
   },

   /*
    * All of the pokemon logic to build this 
    * bomb ass moveset coverage table
    */
   buildCoverageTable: function(){
      var self = this;
      this.coverageTable      = [];
      this.coverageTableMoves = [];
      for(var y in this.typeModels){
         var row = [];
         var rowMoves = [];
         for(var x in this.typeModels){
            var best     = undefined;
            var bestMove = undefined;
            for(var mv in this.pkmn.moves){
               if(this.pkmn.moves[mv].get('type') && (this.pkmn.moves[mv].get('basePower') > 0 || this.pkmn.moves[mv].get('basePowerCallback'))){
                  var mod1 = this.typeModels[y].getDefMod(self.pkmn.moves[mv].get('type'));
                  var mod2 = this.typeModels[x].getDefMod(self.pkmn.moves[mv].get('type'));
                  var finalmod = mod1 * mod2;
                  if(this.typeModels[x].get('name') == this.typeModels[y].get('name')){
                     finalmod = mod1;
                  }
                  if((best == undefined) || (finalmod > best)){
                     best     = finalmod;
                     bestMove = this.pkmn.moves[mv].get('name')
                  }
               }
            }
            row.push(best);
            rowMoves.push(bestMove || '');
         }
         this.coverageTable.push(row);
         this.coverageTableMoves.push(rowMoves);
      }
   },

   /*
    * Set the default moves for a pokemon
    */
   setDefaultMoves: function(){
      var moves = this.pkmn.getAvailableMoveNames();
      for(var i = 0; (i < moves.length) && (i < 4); i++){
         this.pkmn.set('move' + (i + 1), moves[i], {silent: true});
         this.pkmn.moves[i].set('name', moves[i]);
         this.pkmn.moves[i].fetch();
      }
   },

   /*
    * Render the page.
    *
    * Render the pokemon and move dropdowns and the 
    * coverage table
    */
   render: function(){
      this.$el.html('');
      this.buildCoverageTable();
      this.$el.append(this.MovesetCoverageTemplate(this));
      this.renderMoves();
      if(this.pkmnDropDown){
         this.pkmnDropDown.selected = this.pkmn.get('name');
         this.pkmnDropDown.setElement('#pkmndd').render();
      }
   }
});

module.exports = MovesetCoverageView;
