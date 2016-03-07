var Backbone            = require('backbone');
var IvCalcView          = require('./views/IvCalcView');
var MovesetCoverageView = require('./views/MovesetCoverageView.js');
var HomeView            = require('./views/HomeView');
var $                   = require('jquery');

var Router = Backbone.Router.extend({
   initialize: function(){
      this.currentView = null;
   },

   cleanView:function(){
      if(this.currentView){
         this.currentView.undelegateEvents();
      }
   },

   routes:{
      'movecov(/)(:pkmnid)(*moves)' : "moveset",
      'ivcalc(/)(:pkmnid)'          : "ivcalc",
      'home'                        : 'home',
      ''                            : 'home'
   },

   home: function(){
      this.cleanView();
      this.currentView = new HomeView({
         el : $('#app') 
      });
   },

   ivcalc: function(pkmnid){
      this.cleanView();
      var params = {
         el : $('#app')
      };
      if(!pkmnid){// Assign a random pokemon if nothing was passed
         params.pkmnid = Math.ceil((Math.random() * 718));
      }else if(parseInt(pkmnid)){//assign the id if it was passed
         params.pkmnid  = pkmnid;
      }else{//assume a pokemon name was passed in if it can not be parsed into an int
         params.pkmnname = pkmnid;
      }
      this.currentView = new IvCalcView(params);
   },

   moveset: function(pkmnid, moves){
      this.cleanView();
      moves = moves || '';
      var params = {
         el:$('#app'),
         moves: moves.split('/')
      };
      if(!pkmnid){// Assign a random pokemon if nothing was passed
         params.pkmnid = Math.ceil((Math.random() * 718));
      }else if(parseInt(pkmnid)){//assign the id if it was passed
         params.pkmnid  = pkmnid;
      }else{//assume a pokemon name was passed in if it can not be parsed into an int
         params.pkmnname = pkmnid;
      }
      this.currentView = new MovesetCoverageView(params);
   }
});

module.exports = Router;
