define(function () {

	'use strict';

	return Backbone.Model.extend({

		url: 'https://' + HEROQUEST.host + '/history',

		idAttribute: '_id',

		defaults: {
			message: '',
			campaing_id: '',
			access_token: '',
			date: '',
			displayIndex: 0
		}

	});

});