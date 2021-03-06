/*
 * Extend any protoypes (IE) string or write uselful functions here
 */
var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

String.prototype.capitalize = function() {
  if (this.length === 0) {
    return this;
  } else {
    return this[0].toUpperCase() + this.split('').splice(1, this.length).join('');
  }
};

/*
 * Convert 0.25 to 1/4 and 0.5 to 1/2
 */
String.prototype.toFraction = function() {
  var rval = this;
  switch (this) {
    case '0.5' : rval = '1/2'; break;
    case '0.25': rval = '1/4'; break;
  }
  return rval.toString();
};

module.exports = {

  /*
    * Highlight the tabs on the top of the page
    *
    * tab :: Int :: Optional :: 0 based index of the tab to highlight.  Not passing leaves them blank
    */
  updateActiveNav: function(tab) {
    var tabs = $('ul.navbar-nav > li');
    for (var i = 0; i < tabs.length; i++) {
      $(tabs[i]).removeClass('active');
    }
    if (parseInt(tab) >= 0) {
      $(tabs[tab]).addClass('active');
    }
  },

  /*
    * Capitalize the pokemon names...
    * gengar-mega        -> Gengar-Mega
    * charizard-mega-x   -> Charizard-Mega-X
    * vaporeon           -> Vaporeon
    */
  capitalizePkmn: function(name) {
    return name.split('-').map(function(nm) {
      return nm.capitalize();
    }).join('-');
  }

};

/*
 * Boilerplate backbone extensions
 */

/*
 * Reset the model.
 *
 * Default to this.defaults, plus anything passed in as an argument
 */
Backbone.Model.prototype.reset = function(init) {
  this.clear({silent: true}).set(_.extend(this.defaults || {}, init), {silent: true});
};
