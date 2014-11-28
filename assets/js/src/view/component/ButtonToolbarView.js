define([

	'text!template/component/ButtonToolbarView.html'

], function (Template) {

	'use strict';

	return Backbone.View.extend({

		el: Template,


		template: function () {
			return _.template($('<div></div>').append(this.$el).html());
		},


		initialize: function (options) {
			this.options = options;
		},


		addButtons: function (buttons) {
			var i, len = buttons.length;

			for (i = 0; i < len; i++) {
				this.$el.append(buttons[i].render());
			}
		},


		addClass: function (className) {
			this.$el.addClass(className);
		}

	});

});