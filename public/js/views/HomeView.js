var Backbone = require('backbone');
var LayoutView = Backbone.View.extend({
   initialize: function(){
      this.$el.html('');
  },
   template = _.template();
   events:{

   },
   render: function(){
      this.$el.html(this.template());
   }
})
