define([

	'text!template/component/NewModalView.html'

], function (html) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		id: 'modal-' + (new Date()).getTime(),


		initialize: function () {},


		render: function () {
			this.append(this.template({id: this.id}));
			this.$('#' + this.id).modal(this.options);
		},


		show: function () {
			this.$('#' + this.id).modal('show');
		},
		

		hide: function () {
			this.$('#' + this.id).modal('hide');
		},


		bindEvents: function () {
			var self = this;

			this.$('#' + this.id).on('hidden.bs.modal', function (ev) {
				self.undelegateEvents();
				
				$(this).data('modal', null);
				$(this).remove();

				self.onHidden(ev);
			});
		},


		onHidden: function () {}

	});

});