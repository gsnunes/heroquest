define([

	'text!template/component/ListGroupView.html'

], function (Template) {

	'use strict';

	return Backbone.View.extend({

		template: _.template(Template),


		initialize: function (options) {
			this.options = options;
		},


		addItem: function (heading, description) {
			var item = $('<a href="javascript:;" class="list-group-item"><h4 class="list-group-item-heading">' + heading + '</h4><p class="list-group-item-text">' + description + '</p></a>');
			this.$el.find('.list-group').append(item);

			return item;

			/*
			item.on('click', function () {
				cb();
			});
			*/
		},


		reset: function () {
			this.$el.find('.list-group').html('');
		},


		render: function () {
			this.$el.html(this.template());
		}

	});

});