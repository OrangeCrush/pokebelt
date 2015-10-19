var Backbone   = require('backbone');
var Router     = require('./router');
var $          = require('jquery');

$(function(){
   var router = new Router();
   Backbone.history.start();
});
