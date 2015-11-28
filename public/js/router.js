var Backbone   = require('backbone');
var IvCalcView = require('./views/IvCalcView');
var $          = require('jquery');

var Router = Backbone.Router.extend({
   routes:{
      'ivcalc(/)(:pkmnid)' : "ivcalc",
   },

   ivcalc: function(pkmnid){
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
      return new IvCalcView(params);
   }
});

module.exports = Router;
