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


		afterRender: function () {
			var data = GLOBAL.data.furniture,
				i, len = data.length,
				$li;

			for (i = 0; i < len; i++) {
				$li = $('<li data-toggle="tooltip" data-placement="top" title="' + data[i].name + '"><i class="' + data[i].className + '"></i></li>');
				this.$('.pieces-toolbar').append($li);
				$li.data('piece', data[i]);
			}

			this.$('[data-toggle="tooltip"]').tooltip();
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