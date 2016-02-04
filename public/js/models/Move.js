var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var utils = require('../utils');

/*
 * Encapsulate a pokemon move
 *
 *
 * var move = new Move({
 *    name  : 'tackle'
 * });
 * 
 */
var MoveModel = Backbone.Model.extend({
   idAttribute: 'name',

   initialize: function(opts){
      _.extend(this,opts);
      this.set('trigger', true);
   },

   sync: function(method,model){
      switch(method){
         case 'read': return this.getMove();
      }
   },

   getMove: function(){
      var self = this;
      if(self.get('name')){
         var url = "api/v2/move/" + self.get('name').replace(' ', '-').toLowerCase() + '/';
         return utils.pokeapiCall(url, {}, function(results){
            for(key in results){
               self.set(key, results[key], {silent : true});
            }
            if(self.get('trigger')){
               self.trigger('newMoveData');
            }
         });
      }
   },

},{
   GetAllMoveNames: function(next){
      utils.pokeapiCall('api/v2/move/',{
         'limit': 9999
      },function(results){
         next(results.results.map(function(type){
            return type.name;
         }).sort().filter(function(name){
            return name.toLowerCase() != 'shadow' && name.toLowerCase() != 'unknown';
         }));
      });
   }
});

module.exports = MoveModel;
