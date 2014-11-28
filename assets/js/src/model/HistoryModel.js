define(function () {

	'use strict';

	return Backbone.Model.extend({

		url: 'https://192.168.56.101/history',

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