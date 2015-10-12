var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var fs = require('fs');

var IvCalcView = Backbone.View.extend({
   initialize: function(opts){
      this.$el.html('');
      this.IvCalcTemplate = fs.readFileSync(__dirname + '/../../templates/IvCalcTemplate.html', 'utf8');
      this.render();
   },
   events: {

   },
   render: function(){
      this.$el.append(_.template(this.IvCalcTemplate));
   }
});

module.exports = IvCalcView;
