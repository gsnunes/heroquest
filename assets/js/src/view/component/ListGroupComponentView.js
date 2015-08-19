define(function () {

	'use strict';

	return Giraffe.View.extend({

		className: 'list-group',


		addItem: function (item) {
			this.$el.append(item);
		},


		clear: function () {
			this.$el.html('');
		}

	});

});