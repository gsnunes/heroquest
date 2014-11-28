define([

	'text!template/component/ModalView.html'

], function (Template) {

	'use strict';

	return Backbone.View.extend({

		el: $('body'),


		template: _.template(Template),


		initialize: function (options) {
			this.id = 'modal-' + (new Date()).getTime();
			
			this.options = options;

			this.render();
			this.bindEvents();
		},


		render: function () {
			this.$el.append(this.template({id: this.id}));
			this.$el.find('#' + this.id).modal(this.options);
		},


		show: function () {
			this.$el.find('#' + this.id).modal('show');
		},
		

		hide: function () {
			this.$el.find('#' + this.id).modal('hide');
		},


		bindEvents: function () {
			var self = this;

			this.$el.find('#' + this.id).on('hidden.bs.modal', function (ev) {
				self.undelegateEvents();
				
				$(this).data('modal', null);
				$(this).remove();

				self.onHidden(ev);
			});
		},


		onHidden: function () {}

	});

});