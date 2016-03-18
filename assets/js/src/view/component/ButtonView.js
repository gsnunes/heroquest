define([

	'text!template/component/ButtonView.html'

], function (Template) {

	'use strict';

	return Backbone.View.extend({

		el: Template,


		events: {
			'click button': 'test'
		},


		test: function () {
			console.log('testing');
		},


		template: function () {
			return _.template($('<div></div>').append(this.$el).html());
		},


		initialize: function (options) {
			this.options = options || {};
			this.setOptions();
		},


		setOptions: function () {
			if (this.options.style) {
				this.$el.removeClass('btn-default').addClass(this.options.style);
			}

			if (this.options.size) {
				this.$el.addClass(this.options.size);
			}

			if (this.options.caption) {
				this.$el.html(this.options.caption);
			}

			if (this.options.icon) {
				this.$el.prepend('<span class="' + this.options.icon + '"></span>&nbsp;');
			}

			if (this.options.disabled) {
				this.$el.prop('disabled', true);
			}
		},


		render: function () {
			return this.template();
		}

	});

});