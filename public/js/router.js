var Backbone   = require('backbone');
var IvCalcView = require('./views/IvCalcView');
var $          = require('jquery');

var Router = Backbone.Router.extend({
   routes:{
      'ivcalc' : "ivcalc"
   },

   ivcalc: function(){
      var view = new IvCalcView({
         el      : $('#app')
      });
   }
});

module.exports = Router;
