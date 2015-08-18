define([

	'view/component/NewModalView'

], function (NewModalView) {

	'use strict';

	return NewModalView.extend({

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