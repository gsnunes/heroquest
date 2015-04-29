define([

	'model/HistoryModel'

], function (HistoryModel) {

	'use strict';

	return Backbone.Collection.extend({

		initialize: function (models, options) {
			this.campaing_id = options ? options.campaing_id : null;
		},

		url: function () {
			return this.campaing_id ? 'https://' + GLOBAL.host + '/history/' + this.campaing_id : 'https://' + GLOBAL.host + '/history';
		},

		model: HistoryModel

	});

});