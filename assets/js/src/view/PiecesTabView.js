define([

	'text!template/PiecesTabView.html'

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
			var data = GLOBAL.data[this.type],
				i, len = data.length,
				$li;

			for (i = 0; i < len; i++) {
				if (data[i].movement) {
					$li = $('<li data-toggle="tooltip" data-placement="top" title="' + data[i].name + ' (movement: ' + data[i].movement + ', attack: ' + data[i].attack + ', defense: ' + data[i].defense + ', body: ' + data[i].body + ', mind: ' + data[i].mind + ')"><i class="' + data[i].className + '"></i></li>');
				}
				else {
					$li = $('<li data-toggle="tooltip" data-placement="top" title="' + data[i].name + '"><i class="' + data[i].className + '"></i></li>');
				}
				
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