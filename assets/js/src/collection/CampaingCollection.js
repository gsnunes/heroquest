define([

	'model/CampaingModel'

], function (CampaingModel) {

	'use strict';

	return Backbone.Collection.extend({

		url: 'https://' + GLOBAL.host + '/campaing',
		model: CampaingModel

	});

});