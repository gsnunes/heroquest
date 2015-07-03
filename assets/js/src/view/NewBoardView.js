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
		},


		newPiece: function (value) {
			var pieceView = new PieceView(JSON.parse(value));
			pieceView.attachTo(this);
		},


		addPiece: function (ev) {
			if ($(ev.target).hasClass('board')) {
				var key = 'piece-' +  (new Date()).getTime(),
					selectedItem = $('#myTabContent div.active ul.pieces-toolbar li.highlight');

				//GLOBAL.data.monster

				if (selectedItem) {
					gapi.hangout.data.setValue(key, JSON.stringify({id: key, ev: {offsetX: ev.offsetX || ev.originalEvent.layerX, offsetY: ev.offsetY || ev.originalEvent.layerY}}));
				}
			}
		}
		
	});

});