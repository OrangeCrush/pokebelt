var Backbone = require('backbone');

if (window.__backboneAgent) {
  window.__backboneAgent.handleBackbone(Backbone);
}

var Router = require('./router');
var $ = require('jquery');

$(function() {
  var r = new Router(); // eslint-disable-line no-unused-vars
  Backbone.history.start();
});
