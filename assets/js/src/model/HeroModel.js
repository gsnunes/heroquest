define(function () {

	'use strict';

	return Backbone.Model.extend({

		defaults: {
			name: '',
			description: '',
			character: '',
			quests: 0
		}

	});

});