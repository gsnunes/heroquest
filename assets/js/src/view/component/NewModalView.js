define([

	'text!template/component/NewModalView.html'

], function (html) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		className: 'modal fade',


		id: 'modal-' + (new Date()).getTime(),


		initialize: function () {
			this.attached = false;
			this.bindEvents();
		},


		setBody: function (data) {
			this.$('.modal-body').html(data);
		},


		setTitle: function (data) {
			this.$('.modal-title').html(data);
		},


		open: function () {
			if (!this.attached) {
				this.attached = true;
				this.attachTo(Giraffe.app);
			}
			
			this.$el.modal('show');
		},


		close: function () {
			this.$el.modal('hide');
		},


		bindEvents: function () {
			var self = this;

			this.$el.on('hidden.bs.modal', function (ev) {
				self.undelegateEvents();
				
				$(this).data('modal', null);
				$(this).remove();

				//https://github.com/nakupanda/bootstrap3-dialog/issues/70
				$('.modal').each(function () {
					if ($(this).is(':visible')) {
						$('body').addClass('modal-open');
					}
				});

				if (self.onHidden) {
					self.onHidden(ev);
				}
			});
		}

	});

});