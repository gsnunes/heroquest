define([

	'model/CampaingModel'

], function (CampaingModel) {

	'use strict';

	return Backbone.Collection.extend({

		url: 'https://192.168.56.101/campaing',
		model: CampaingModel

	});

});