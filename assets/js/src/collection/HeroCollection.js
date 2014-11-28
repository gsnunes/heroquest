define([

	'model/HeroModel'

], function (HeroModel) {

	'use strict';

	return Backbone.Collection.extend({

		url: 'https://192.168.56.101/hero',
		model: HeroModel

	});

});