define([

	'model/CampaingModel'

], function (CampaingModel) {

	'use strict';

	return Backbone.Collection.extend({

		url: 'https://' + HEROQUEST.host + '/campaing',
		model: CampaingModel

	});

});