define([

	'model/CharModel'

], function (CharModel) {

	'use strict';

	return Backbone.Collection.extend({

		url: 'https://' + HEROQUEST.host + '/char',
		model: CharModel

	});

});