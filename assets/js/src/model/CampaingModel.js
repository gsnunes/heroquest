define(function () {

	'use strict';

	return Backbone.Model.extend({

		idAttribute: '_id',

		defaults: {
			name: '',
			description: '',
			access_token: ''
		}

	});

});