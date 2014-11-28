define(function () {

	'use strict';

	return Backbone.View.extend({

		initialize: function (options) {
			this.options = options;
		},


		render: function () {
			this.$el.popover(this.options);
		},
		

		destroy: function () {
			this.$el.popover('destroy');
		}

	});

});