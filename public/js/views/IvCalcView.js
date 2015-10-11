var _ = require('underscore');
var $ = require('jquery');

var IvCalcView = Backbone.View.extend({
   initialize: function(opts){
      this.$el.html('');
      this.render();
      this.pokemon = new Pokemon(opts.pokemon);
   },
   events: {
      
   },
   template: _.template(IVCalcView)
   render: function(){
      this.$el.append(this.template());
   }
});

module.exports = IvCalcView;
