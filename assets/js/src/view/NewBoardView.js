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
			if (ev.addedKeys.length && ev.addedKeys[0].key.match(/piece/gi)) {
				if (!this.$el.find('#' + ev.addedKeys[0].key).length) {
					this.newPiece(ev.state[ev.addedKeys[0].key]);
				}
			}
			else if (ev.removedKeys.length && ev.removedKeys[0].match(/piece/gi)) {
				if (this.$el.find('#' + ev.removedKeys[0]).length) {
					this.$el.find('#' + ev.removedKeys[0]).remove();
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