var Backbone = require('backbone');
var Characteristics = require('../data/characteristic');

/*
 * Encapsulate a Pokemon characteristic 
 *
 * var myChar = new Constructor({
 *    name: "Likes to thrash about"
 * });
 *
 */
var CharacteristicModel = Backbone.Model.extend({
  idAttribute: 'name',
  initialize: function(opts) {
    if (!opts) {
      throw new Error('Constructor args can not be null.');
    }
    this.set('name', opts.name.toLowerCase());
  },

  defaults: {
    'trigger_event': true
  },

  sync: function(method) {
    switch (method) {
      case 'read':
        this.getCharacteristicData();
    }
  },

  getCharacteristicData: function() {
    var self = this;
    var chars = Characteristics.data.filter(function(characteristic) {
      return self.get('name').toLowerCase() === characteristic.name.toLowerCase();
    });

    if (chars.length === 1) {
      self.set('name', chars[0].name);
      self.set('stat', chars[0].stat);
      self.set('ivs', chars[0].ivs);
    }
    if (self.get('trigger')) {
      self.trigger('newCharacteristicData');
    }
  }

}, {
  GetAllCharacteristics: function(next) {
    next(Characteristics.data.map(function(x) {
      return x.name;
    }));
  }

});

module.exports = CharacteristicModel;
