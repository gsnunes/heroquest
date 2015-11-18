define([

	'view/PieceView'

], function (PieceView) {

	'use strict';

	return Giraffe.View.extend({


		className: 'board',


		events: {
			'click': 'addPiece'
		},


		initialize: function () {
			this.bindEvents();
		},


		afterRender: function () {
			this.populate();
		},


		populate: function () {
			var state = gapi.hangout.data.getState(),
				_this = this;

			_.each(state, function (value, key) {
				if (key.match(/piece/gi)) {
					_this.newPiece(value);
				}
			});
		},


		bindEvents: function () {
			gapi.hangout.data.onStateChanged.add(_.bind(function (ev) {
				this.changeBoard(ev);
			}, this));
		},


		changeBoard: function (ev) {
			var i = 0, len, piece;

			if (ev.addedKeys.length) {
				len = ev.addedKeys.length;

				for (i = 0; i < len; i++) {
					if (ev.addedKeys[i].key.match(/piece/gi)) {
						if (!this.$el.find('#' + ev.addedKeys[i].key).length) {
							this.newPiece(ev.state[ev.addedKeys[i].key]);
						}
					}
				}
			}
			else if (ev.removedKeys.length) {
				len = ev.removedKeys.length;

				for (i = 0; i < len; i++) {
					if (ev.removedKeys[i].match(/piece/gi)) {
						piece = this.$el.find('#' + ev.removedKeys[i]);

						if (piece.length) {
							piece.popover('destroy');
							piece.remove();
						}
					}
				}
			}
		},


		newPiece: function (value) {
			var pieceView = new PieceView(JSON.parse(value));
			pieceView.attachTo(this);
		},


		addPiece: function (ev) {
			var key = 'piece-' +  (new Date()).getTime(),
				itemSelected = GLOBAL.toolbar.itemSelected;

			if ($(ev.target).hasClass('board')) {
				if (itemSelected && itemSelected.length) {
					gapi.hangout.data.setValue(key, JSON.stringify({id: key, position: {offsetX: ev.offsetX || ev.originalEvent.layerX, offsetY: ev.offsetY || ev.originalEvent.layerY}, model: itemSelected.data('piece')}));
				}
			}
		}

	});

});
