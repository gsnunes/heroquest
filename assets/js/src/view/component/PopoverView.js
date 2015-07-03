define(function () {

	'use strict';

	return Giraffe.View.extend({

		initialize: function (options) {
			this.options = options;
		},


		render: function () {
			this.$el.popover(this.options);
		}

	});

});