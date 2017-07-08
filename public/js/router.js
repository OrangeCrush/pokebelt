var Backbone = require('backbone');
var IvCalcView = require('./views/IvCalcView');
var MovesetCoverageView = require('./views/MovesetCoverageView.js');
var HomeView = require('./views/HomeView');
var $ = require('jquery');
var PokemonModel = require('./models/Pokemon');

var Router = Backbone.Router.extend({
  initialize: function() {
    this.currentView = null;
  },

  cleanView: function() {
    if (this.currentView) {
      this.currentView.undelegateEvents();
    }
  },

  routes: {
    'movecov(/)(:pkmnid)(*moves)': 'moveset',
    'ivcalc(/)(:pkmnid)': 'ivcalc',
    'home': 'home',
    '': 'home'
  },

  home: function() {
    this.cleanView();
    this.currentView = new HomeView({
      el: $('#app')
    });
  },

  ivcalc: function(pkmnid) {
    this.cleanView();
    var params = {
      el: $('#app'),
      pkmnname: pkmnid || PokemonModel.GetRandomPokemon()
    };
    this.currentView = new IvCalcView(params);
  },

  moveset: function(pkmnid, moves) {
    this.cleanView();
    moves = moves || '';
    var params = {
      el: $('#app'),
      moves: moves.split('/'),
      pkmnname: pkmnid || PokemonModel.GetRandomPokemon()
    };
    this.currentView = new MovesetCoverageView(params);
  }
});

module.exports = Router;
