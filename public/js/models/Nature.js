var Backbone = require('backbone');
var $ = require('jquery');
var utils = require('../utils');
var _ = require('underscore');

/*
 * Encapsulate a pokemon type
 *
 *
 * var nature = new Nature({
 *    name : 'adamant'
 * });
 * 
 */
var NatureModel = Backbone.Model.extend({
   idAttribute: 'name',

   initialize: function(opts){
      var self = this;
      if(!opts){
         throw "Constructor args can not be null";
      }else if(opts.name){
         self.set('name', opts.name.toLowerCase())
      }
      this.fetch();
   },

   sync: function(method,model){
      switch(method){
         case 'read': this.getNature(); break;
      }
   },

   getNature: function(){
      var self = this;
      var attrs = _.select(self.natureData, function(x){
         return x.name.toLowerCase() == self.get('name');
      });
      for(key in attrs[0]){
         self.set(key, attrs[0][key]);
      }
   },

   getModForStat: function(stat){
      return this.get(stat.toLowerCase());
   },

   getAllNatures: function(){
      return this.natureData.map(function(nature){
         return nature.name;                                            
      });
   },


   natureData: [
   {
      "atk": 1.1,
      "def": 1,
      "hp": 1,
      "name": "Adamant",
      "spa": 0.9,
      "spd": 1,
      "spe": 1,
      "summary": "+Atk, -SpA"
   },
   {
      "atk": 1,
      "def": 1,
      "hp": 1,
      "name": "Bashful",
      "spa": 1,
      "spd": 1,
      "spe": 1,
      "summary": ""
   },
   {
      "atk": 0.9,
      "def": 1.1,
      "hp": 1,
      "name": "Bold",
      "spa": 1,
      "spd": 1,
      "spe": 1,
      "summary": "+Def, -Atk"
   },
   {
      "atk": 1.1,
      "def": 1,
      "hp": 1,
      "name": "Brave",
      "spa": 1,
      "spd": 1,
      "spe": 0.9,
      "summary": "+Atk, -Spe"
   },
   {
      "atk": 0.9,
      "def": 1,
      "hp": 1,
      "name": "Calm",
      "spa": 1,
      "spd": 1.1,
      "spe": 1,
      "summary": "+SpD, -Atk"
   },
   {
      "atk": 1,
      "def": 1,
      "hp": 1,
      "name": "Careful",
      "spa": 0.9,
      "spd": 1.1,
      "spe": 1,
      "summary": "+SpD, -SpA"
   },
   {
      "atk": 1,
      "def": 1,
      "hp": 1,
      "name": "Docile",
      "spa": 1,
      "spd": 1,
      "spe": 1,
      "summary": ""
   },
   {
      "atk": 1,
      "def": 0.9,
      "hp": 1,
      "name": "Gentle",
      "spa": 1,
      "spd": 1.1,
      "spe": 1,
      "summary": "+SpD, -Def"
   },
   {
      "atk": 1,
      "def": 1,
      "hp": 1,
      "name": "Hardy",
      "spa": 1,
      "spd": 1,
      "spe": 1,
      "summary": ""
   },
   {
      "atk": 1,
      "def": 0.9,
      "hp": 1,
      "name": "Hasty",
      "spa": 1,
      "spd": 1,
      "spe": 1.1,
      "summary": "+Spe, -Def"
   },
   {
      "atk": 1,
      "def": 1.1,
      "hp": 1,
      "name": "Impish",
      "spa": 0.9,
      "spd": 1,
      "spe": 1,
      "summary": "+Def, -SpA"
   },
   {
      "atk": 1,
      "def": 1,
      "hp": 1,
      "name": "Jolly",
      "spa": 0.9,
      "spd": 1,
      "spe": 1.1,
      "summary": "+Spe, -SpA"
   },
   {
      "atk": 1,
      "def": 1.1,
      "hp": 1,
      "name": "Lax",
      "spa": 1,
      "spd": 0.9,
      "spe": 1,
      "summary": "+Def, -SpD"
   },
   {
      "atk": 1.1,
      "def": 0.9,
      "hp": 1,
      "name": "Lonely",
      "spa": 1,
      "spd": 1,
      "spe": 1,
      "summary": "+Atk, -Def"
   },
   {
      "atk": 1,
      "def": 0.9,
      "hp": 1,
      "name": "Mild",
      "spa": 1.1,
      "spd": 1,
      "spe": 1,
      "summary": "+SpA, -Def"
   },
   {
      "atk": 0.9,
      "def": 1,
      "hp": 1,
      "name": "Modest",
      "spa": 1.1,
      "spd": 1,
      "spe": 1,
      "summary": "+SpA, -Atk"
   },
   {
      "atk": 1,
      "def": 1,
      "hp": 1,
      "name": "Naive",
      "spa": 1,
      "spd": 0.9,
      "spe": 1.1,
      "summary": "+Spe, -SpD"
   },
   {
      "atk": 1.1,
      "def": 1,
      "hp": 1,
      "name": "Naughty",
      "spa": 1,
      "spd": 0.9,
      "spe": 1,
      "summary": "+Atk, -SpD"
   },
   {
      "atk": 1,
      "def": 1,
      "hp": 1,
      "name": "Quiet",
      "spa": 1.1,
      "spd": 1,
      "spe": 0.9,
      "summary": "+SpA, -Spe"
   },
   {
      "atk": 1,
      "def": 1,
      "hp": 1,
      "name": "Quirky",
      "spa": 1,
      "spd": 1,
      "spe": 1,
      "summary": ""
   },
   {
      "atk": 1,
      "def": 1,
      "hp": 1,
      "name": "Rash",
      "spa": 1.1,
      "spd": 0.9,
      "spe": 1,
      "summary": "+SpA, -SpD"
   },
   {
      "atk": 1,
      "def": 1.1,
      "hp": 1,
      "name": "Relaxed",
      "spa": 1,
      "spd": 1,
      "spe": 0.9,
      "summary": "+Def, -Spe"
   },
   {
      "atk": 1,
      "def": 1,
      "hp": 1,
      "name": "Sassy",
      "spa": 1,
      "spd": 1.1,
      "spe": 0.9,
      "summary": "+SpD, -Spe"
   },
   {
      "atk": 1,
      "def": 1,
      "hp": 1,
      "name": "Serious",
      "spa": 1,
      "spd": 1,
      "spe": 1,
      "summary": ""
   },
   {
      "atk": 0.9,
      "def": 1,
      "hp": 1,
      "name": "Timid",
      "spa": 1,
      "spd": 1,
      "spe": 1.1,
      "summary": "+Spe, -Atk"
   }]
});

module.exports = NatureModel;
