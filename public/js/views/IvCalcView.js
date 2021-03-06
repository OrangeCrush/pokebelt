var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var fs = require('fs');
var Pokemon = require('../models/Pokemon');
var Nature = require('../models/Nature');
var Characteristic = require('../models/Characteristic');
var DropDownView = require('./DropDownView');
var utils = require('../utils');

/*
 * Display the IVcalc page
 *
 * var ivc = new IvCalcView({
 *    el        : $('#app'),  // Required :: String :: Element to build in
 *    showRows  : 10          // Optional :: Int    :: Number of iv rows to show
 *    pkmnid    : 25          // Optional :: Int    :: Pokemon ID to start with. Takes precedence over pkmnname
 *    pkmnname  : 'Pikachu'   // Optional :: String :: Pokemon to start with
 * });
 *
 * Only refresh the page on a data update event
 * Changing a pokemon's name passes control to the router
 *
 */
var IvCalcView = Backbone.View.extend({
  initialize: function(opts) {
    utils.updateActiveNav(0);

    this.pkmnDropDown = new DropDownView({
      src: Pokemon.GetAllPokemonNames,
      id: 'pokemon',
      el: '#pkmndd',
      classes: 'form-control resubmit',
      label: 'Pokemon',
      sorted: true,
      data: {
        attr: 'name'
      }
    });
    this.pkmnDropDown.refresh();
    this.pkmnDropDown.on('newDropDownData', this.pkmnDropDown.render, this.pkmnDropDown);

    this.natDropDown = new DropDownView({
      src: Nature.GetAllNatures,
      id: 'nature',
      el: '#naturedd',
      classes: 'form-control resubmit',
      label: 'Nature',
      selected: 'Adamant',
      sorted: true,
      data: {
        attr: 'nature'
      }
    });
    this.natDropDown.refresh();
    this.natDropDown.on('newDropDownData', this.natDropDown.render, this.natDropDown);

    this.charDropDown = new DropDownView({
      src: Characteristic.GetAllCharacteristics,
      id: 'characteristic',
      el: '#chardd',
      classes: 'form-control resubmit',
      label: 'Characteristic',
      optional: true,
      sorted: true,
      data: {
        attr: 'characteristic'
      }
    });
    this.charDropDown.refresh();
    this.charDropDown.on('newDropDownData', this.charDropDown.render, this.charDropDown);

    this.pkmn = new Pokemon({
      name: opts.pkmnname,
      level: 50,
      nature: 'adamant',
      characteristic: ''
    });

    // On these fields changing, re-render the view
    this.pkmn.on('change:level', this.render, this);
    this.pkmn.on('change:ev_hp', this.render, this);
    this.pkmn.on('change:ev_atk', this.render, this);
    this.pkmn.on('change:ev_def', this.render, this);
    this.pkmn.on('change:ev_spa', this.render, this);
    this.pkmn.on('change:ev_spd', this.render, this);
    this.pkmn.on('change:ev_spe', this.render, this);
    this.pkmn.on('newPkmnData', this.render, this);

    this.pkmn.characteristic.on('newCharacteristicData', this.render, this);
    this.pkmn.nature.on('newNatureData', this.render, this);
    this.pkmn.on('newPkmnStatData', this.render, this);

    this.pkmn.fetch();
  },

  IvCalcTemplate: _.template(fs.readFileSync(__dirname + '/../../templates/IvCalcTemplate.html', 'utf8')),

  /*
    * Set the appropriate data when form fields change
    */
  events: {
    'change  .resubmit': 'updateData'
  },

  /*
    * Fire on any change event from .resubmit elements.
    * Update the "data-stat" value to the val of the element.
    * Cast anything to an integer that looks like one
    *
    * Handle special cases (nature, characteristic) first
    */
  updateData: function(e) {
    this.pkmn.set($(e.target).data('attr'), parseInt($(e.target).val()) || $(e.target).val().toLowerCase());
    if ($(e.target).data('attr') === 'name') {
      Backbone.history.navigate('/ivcalc/' + $('#pokemon').val());
    }
  },

  /*
    * Calculate the IV table for each IV value
    */
  calcIvTable: function(e) {
    this.ivTable = [];
    // Calc status at each IV, store in a table
    for (var i = 0; i < 32; i++) {
      for (var stat in this.pkmn.stats) {
        // We don't want to trigger a change with this set
        this.pkmn.set('iv_' + this.pkmn.stats[stat], 31 - i, { silent: true });
      }
      this.pkmn.resolveAllStats();
      this.ivTable.push([
        this.pkmn.get('hp'),
        this.pkmn.get('atk'),
        this.pkmn.get('def'),
        this.pkmn.get('spa'),
        this.pkmn.get('spd'),
        this.pkmn.get('spe')
      ]);
    }

    this.charTable = [];
    if (this.pkmn.get('characteristic') !== '') {
      for (var j = 0; j < 32; j++) {
        this.charTable.push([]);
        for (var st in this.pkmn.stats) {
          if (this.pkmn.characteristic.get('ivs').indexOf(31 - j) === -1 && this.pkmn.stats[st] === this.pkmn.characteristic.get('stat')) {
            this.charTable[j].push('strike');
          } else {
            this.charTable[j].push('');
          }
        }
      }
    }
  },

  /*
    * 1) calculate the iv table
    * 2) Clear whatever is in #app
    * 3) Append the newly generated html to app
    *
    * Only called on a newPkmnData event from Pokemon.js
    * or a change to any ".resubmit" element
    *
    */
  render: function() {
    this.calcIvTable();
    this.$el.html('');
    this.$el.append(this.IvCalcTemplate(this));

    this.pkmnDropDown.selected = this.pkmn.get('name');
    this.pkmnDropDown.setElement('#pkmndd').render();

    this.natDropDown.selected = this.pkmn.get('nature');
    this.natDropDown.setElement('#naturedd').render();

    this.charDropDown.selected = this.pkmn.get('characteristic');
    this.charDropDown.setElement('#chardd').render();
  }
});

module.exports = IvCalcView;
