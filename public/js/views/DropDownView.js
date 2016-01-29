var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var fs = require('fs');

/*
 * Reuseable view to populate a dropdown.
 *
 * var pkmnDropDown = new DropDownView({
 *   el  : '#pokemon',               //Required  :: Jquery obj :: Element to build in
 *   src : [1,2,3,4],                //Required  :: Array      :: Populate with the passed array
 *   src : function(){...},          //Required  :: function   :: Call the passed fn, which must have the format
 *                                                             ::  function(next){ ... }
 *                                                             :: Where next is passed the src array.
 *   id       : 'pokemon'            // Optional :: String     :: id to use on the <select> tag
 *   classes  : 'color strike blue'  // Optional :: String     :: classes to use on the <select> tag
 *   attr     : {attr: name, move:1} // Optional :: Obj        :: Add data-attr="name" and data-move="1" to the select
 *   selected : 'bulbasaur'          // Optional :: String     :: Specify the selected element
 *   label    : Pokemon              // Optional :: String     :: <label> value to use above the select
 * });
 *
 * Events:
 *   newDropDownData  :: Fired when this.list is updated 
 * 
 */
var DropDownView = Backbone.View.extend({
   initialize: function(opts){
      this.list     = [];
      this.selected = '';
      this.label    = '';
      _.extend(this, opts)
   },

   refresh: function(){
      var self = this;
      if(this.src.constructor ==  Array){
         self.list = self.src;
         self.trigger('newDropDownData');
      }else if(typeof self.src === 'function'){
         self.src(function(results){
            self.list = results;
            self.trigger('newDropDownData');
         });
      }
   },

   DropDownTemplate: _.template(fs.readFileSync(__dirname + '/../../templates/DropDownTemplate.html', 'utf8')),

   /*
    * Attach any data elements to the select
    */
   render: function(){
      this.$el.html('');
      this.$el.append(this.DropDownTemplate(this));
      for(var key in this.data){
         this.$('select').attr('data-' + key, this.data[key]);
      }
   }

});

module.exports = DropDownView;
