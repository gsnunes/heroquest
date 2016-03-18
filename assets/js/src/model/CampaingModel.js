define(function () {

	'use strict';

	return Backbone.Model.extend({

		defaults: {
			name: '',
			description: '',
			state: {},
			url: ''
		}

	});

});