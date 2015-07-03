define(function () {

	'use strict';

	return Backbone.Model.extend({

		defaults: {
			name: '',
			description: '',
			moviment: 0,
			attack: 0,
			defense: 0,
			body: 0,
			mind: 0
		}

	});

});