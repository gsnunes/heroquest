define(function () {

	'use strict';

	return Backbone.Model.extend({

		url: 'https://' + HEROQUEST.host + '/history',

		defaults: {
			message: '',
			campaing_id: '',
			date: '',
			displayIndex: 0
		}

	});

});