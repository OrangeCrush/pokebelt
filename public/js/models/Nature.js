var Backbone = require('backbone');
var Natures = require('../data/nature');

/*
 * Encapsulate a Pokemon Nature
 *
 *
 * var nature = new Nature({
 *    name : 'adamant'
 * });
 * 
 */
var NatureModel = Backbone.Model.extend({
  idAttribute: 'name',

  initialize: function(opts) {
    var self = this;
    self.set('trigger', true);
    if (!opts) {
      throw new Error('Constructor args can not be null');
    } else if (opts.name) {
      self.set('name', opts.name.toLowerCase());
    }
  },

  defaults: {
    'trigger_event': true
  },

  sync: function(method, model) {
    switch (method) {
      case 'read': return this.getNature();
    }
  },

  getNature: function() {
    var self = this;
    if (this.get('name')) {
      var nature = Natures.data.filter(function(x) {
        return x.name === self.get('name').toLowerCase();
      })[0];

      for (var i in nature) {
        this.set(i, nature[i], {silent: true});
      }

      this.normalizeMod();

      if (this.get('trigger_event')) {
        this.trigger('newNatureData');
      }
    }
  },

  normalizeMod: function() {
    var stats = {
      hp: 'hp',
      atk: 'attack',
      def: 'defense',
      spa: 'special-attack',
      spd: 'special-defense',
      spe: 'speed'
    };
    for (var stat in stats) {
      if (this.get('decreased_stat') === stats[stat]) {
        this.set(stat, 0.9, {silent: true});
      } else if (this.get('increased_stat') === stats[stat]) {
        this.set(stat, 1.1, {silent: true});
      } else {
        this.set(stat, 1, {silent: true});
      }
    }
  },

  getModForStat: function(stat) {
    return this.get(stat.toLowerCase());
  }
}, {
  GetAllNatures: function(next) {
    next(Natures.data.map(function(x) {
      return x.name.capitalize();
    }));
  }
});

module.exports = NatureModel;
