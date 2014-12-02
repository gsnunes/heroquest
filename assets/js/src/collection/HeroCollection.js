define([

	'model/HeroModel'

], function (HeroModel) {

	'use strict';

	return Backbone.Collection.extend({

		url: 'https://' + HEROQUEST.host + '/hero',
		model: HeroModel

	});

});