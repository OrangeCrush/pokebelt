var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var fs = require('fs');
var utils = require('../utils');

var HomeView = Backbone.View.extend({
   initialize: function(){
      utils.updateActiveNav();
      this.render();
   },

   HomeTemplate : _.template(fs.readFileSync(__dirname + '/../../templates/HomeTemplate.html','utf8')),

   render: function(){
      this.$el.html('');
      this.$el.append(this.HomeTemplate(this));
   }
});

module.exports = HomeView;
