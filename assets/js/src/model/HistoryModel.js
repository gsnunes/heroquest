define(function () {

	'use strict';

	return Backbone.Model.extend({

		url: 'https://' + GLOBAL.host + '/history',

		defaults: {
			message: '',
			campaing_id: '',
			date: '',
			displayIndex: 0
		}

	});

});