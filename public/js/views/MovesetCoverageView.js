var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var fs = require('fs');
var DropDownView = require('./DropDownView');
var Pokemon = require('../models/Pokemon');
var Type = require('../models/Type');
var utils = require('../utils');

/*
 * Display a Moveset Coverage Tool
 */
var MovesetCoverageView = Backbone.View.extend({

   initialize: function(opts){
      var self = this;
      utils.updateActiveNav(1);

      // The familiar this.pkmn PokemonModel
      this.pkmn = new Pokemon({
         id             : opts.pkmnid, 
         name           : opts.pkmnname
      });

      this.pkmnDropDown = new DropDownView({
         src : Pokemon.GetAllPokemonNames,
         id  : 'pokemon',
         el  : '#pkmndd',
         classes: 'form-control resubmit', 
         label : 'Pokemon',
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
            src: self.pkmn.getAvailableMoveNames(),
            id: 'move' + (i + 1),
            el: '#move' + (i + 1) + 'dd' ,
            classes: 'form-control resubmit', 
            label : 'Move' + (i + 1),
            data: {
               attr: 'move' + (i + 1)
            }
         }));
         this.moveDropDowns[i].refresh();
         this.moveDropDowns[i].on('newDropDownData', this.moveDropDowns[i].render, this.moveDropDowns[i]);
      }

      this.pkmn.on('newPkmnStatData', this.render, this);
      this.pkmn.on('newPkmnData',     this.render, this);
      this.pkmn.fetch();
   },

   MovesetCoverageTemplate: _.template(fs.readFileSync(__dirname + '/../../templates/MovesetCoverageTemplate.html', 'utf8')),

   events:{
      'change .resubmit' : 'updateModels',
   },

   /*
    * Handle UI events for changing pokemon or moves
    */
   updateModels: function(e){
      if($(e.target).data('attr') == 'pokemon'){
         this.pkmn.set('name', $(e.target).val());
         Backbone.history.navigate('/movecov/' + $('#pokemon').val());
      }else{

      }
   },

   /*
    * Render the move drop downs with this function
    */
   renderMoves: function(){
      for(var i = 0; i < 4; i++){
         this.moveDropDowns[i].src      = this.pkmn.getAvailableMoveNames();
         this.moveDropDowns[i].selected = this.pkmn.getAvailableMoveNames()[i]
         this.moveDropDowns[i].refresh().setElement('#move' + (i + 1) + 'dd').render();
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
      this.$el.append(this.MovesetCoverageTemplate(this));
      this.renderMoves();
      this.pkmnDropDown.selected = this.pkmn.get('name');
      this.pkmnDropDown.setElement('#pkmndd').render();
   }
});

module.exports = MovesetCoverageView;
