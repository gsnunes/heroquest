define([

	'model/CharModel'

], function (CharModel) {

	'use strict';

	return Backbone.Collection.extend({

		url: 'https://' + GLOBAL.host + '/char',
		model: CharModel

	});

});