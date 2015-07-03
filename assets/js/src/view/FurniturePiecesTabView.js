define([

	'text!template/FurniturePiecesTabView.html'

], function (html) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		events: {
			'click li': 'select'
		},


		initialize: function () {
			$('body').keyup(_.bind(this.unselect, this));
		},


		select: function (ev) {
			$(ev.currentTarget).toggleClass('selected').siblings().removeClass('selected');
			GLOBAL.toolbar.itemSelected = this.$('li.selected');
		},


		unselect: function (ev) {
			if (ev) {
				if (ev.keyCode === 27) {
					this.$('li').removeClass('selected');
					GLOBAL.toolbar.itemSelected = this.$('li.selected');
				}
			}
			else {
				this.$('li').removeClass('selected');
				GLOBAL.toolbar.itemSelected = this.$('li.selected');
			}
		}

	});

});