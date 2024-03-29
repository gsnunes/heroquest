define([

	'text!template/component/AlertModalView.html',
	'view/component/NewModalView'

], function (html, NewModalView) {

	'use strict';

	return NewModalView.extend({

		template: html,
		

		events: {
			'click .btn-primary': 'confirm'
		},


		confirm: function () {
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
		}

	});

});