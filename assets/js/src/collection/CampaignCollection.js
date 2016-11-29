define([

	'model/CampaignModel'

], function (CampaignModel) {

	'use strict';

	return Backbone.Collection.extend({

		url: 'https://' + GLOBAL.host + '/campaign',
		model: CampaignModel

	});

});