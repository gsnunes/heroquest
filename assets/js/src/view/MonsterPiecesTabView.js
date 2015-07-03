define([

	'text!template/MonsterPiecesTabView.html'

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
			var data = GLOBAL.data.monster,
				i, len = data.length,
				$li;

			for (i = 0; i < len; i++) {
				$li = $('<li data-toggle="tooltip" data-placement="top" title="' + data[i].name + ' (moviment: ' + data[i].moviment + ', attack: ' + data[i].attack + ', defense: ' + data[i].defense + ', body: ' + data[i].body + ', mind: ' + data[i].mind + ')"><i class="sprite-monsters icon-' + data[i].name.toLowerCase().replace(' ', '-') + '"></i></li>');
				this.$('.pieces-toolbar').append($li);
				$li.data('monster', data[i]);
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