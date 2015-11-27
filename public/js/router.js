var Backbone   = require('backbone');
var IvCalcView = require('./views/IvCalcView');
var $          = require('jquery');

var Router = Backbone.Router.extend({
   routes:{
      'ivcalc(/)(:pkmnid)' : "ivcalc",
   },

   ivcalc: function(pkmnid){
      var view = new IvCalcView({
         el      : $('#app'),
         pkmnid  : pkmnid || Math.ceil((Math.random() * 718)),
      });
   }
});

module.exports = Router;
