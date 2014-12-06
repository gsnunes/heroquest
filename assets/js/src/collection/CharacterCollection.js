define([

	'model/CharacterModel'

], function (CharacterModel) {

	'use strict';

	return Backbone.Collection.extend({

		url: 'https://' + HEROQUEST.host + '/character',
		model: CharacterModel

	});

});