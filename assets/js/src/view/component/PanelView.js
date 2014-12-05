define([

	'text!template/component/PanelView.html'

], function (Template) {

	'use strict';

	return Backbone.View.extend({

		template: _.template(Template),


		className: '',


		events: {
			'dbClick .panel-heading': 'togglePanel',
			'click button.minimize': 'togglePanel'
		},


		initialize: function (options) {
			this.options = options;
		},


		render: function () {
			this.$el.append(this.template({className: this.className, options: this.options}));

			$('.draggable.panel').draggable({
				containment: '.board',
				handle: '.panel-heading'
			});

			var self = this;
			$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
				self.onTabChange(e.target);
			});
		},


		onTabChange: function () {
			//to be implemented
		},
		

		togglePanel: function (ev) {
			$(ev.target).parents('div.panel').find('.panel-body').toggle();
		}

	});

});