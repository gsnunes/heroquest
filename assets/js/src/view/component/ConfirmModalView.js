define([

	'view/component/NewModalView'

], function (NewModalView) {

	'use strict';

	return NewModalView.extend({

		events: {
			'click .btn-yes': 'yes'
		},


		yes: function () {
			if (this.callback) {
				this.callback();
			}
		},


		afterRender: function () {
			if (this.title) {
				this.setTitle(this.title);
			}

			if (this.body) {
				this.setBody(this.body);
			}

			if (this.type) {
				this.$('.modal-body').addClass('alert-' + this.type);
				this.$('.btn-yes').addClass('btn-' + this.type);
			}
		}

	});

});