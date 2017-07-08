var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var Moves = require('../data/moves');

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

  initialize: function(opts) {
    _.extend(this, opts);
  },

  defaults: {
    'trigger_event': true
  },

  sync: function(method, model) {
    switch (method) {
      case 'read': return this.getMove();
    }
  },

  getMove: function() {
    var self = this;
    if (this.get('name')) {
      this.reset({'name': this.get('name')});
      var moveKey = Object.keys(Moves.data).filter(function(x) {
        return Moves.data[x].name === self.get('name');
      })[0];

      var move;
      for (var i in move = Moves.data[moveKey]) {
        this.set(i, move[i], {silent: true});
      }
      if (this.get('trigger_event')) {
        this.trigger('newMoveData');
      }
    }
    return $.Deferred().resolve().promise();
  }

}, {
  GetAllMoveNames: function(next) {
    next(Object.keys(Moves.data).map(function(x) {
      return Moves.data[x].name;
    }).sort());
  }
});

module.exports = MoveModel;
