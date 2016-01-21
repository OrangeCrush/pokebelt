var Backbone   = require('backbone');

if (window.__backboneAgent) {
     window.__backboneAgent.handleBackbone(Backbone);
}

var Router     = require('./router');
var $          = require('jquery');

$(function(){
   
   var router = new Router();
   Backbone.history.start();
});

