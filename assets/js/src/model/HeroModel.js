define(function () {

	'use strict';

	return Backbone.Model.extend({

		idAttribute: '_id',

		defaults: {
			name: '',
			description: '',
			character: '',
			quests: 0,
			access_token: ''
		}

	});

});