define(['text!template/component/NewPanelView.html'], function (html) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		events: {
			'dbClick .panel-heading': 'togglePanel',
			'click button.close': 'togglePanel'
		},


		togglePanel: function (ev) {
			$(ev.target).parents('div.panel').find('.panel-body').toggle();
		},


		afterRender: function () {
			this.setDraggable();
		},


		setDraggable: function () {
			this.$('.panel').draggable({
				containment: '.board',
				handle: '.panel-heading'
			});
		},


		setTitle: function (data) {
			this.$('.panel-title').html(data);
		},


		setBody: function (data) {
			this.$('.panel-body').html(data);
		},


		setFooter: function (data) {
			this.$('.panel-footer').html(data);
		}

	});

});