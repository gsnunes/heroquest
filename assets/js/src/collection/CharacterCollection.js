define([

	'model/CharacterModel'

], function (CharacterModel) {

	'use strict';

	return Backbone.Collection.extend({

		url: 'https://' + GLOBAL.host + '/character',
		model: CharacterModel

	});

});