define(function (require) {
 
	"use strict";

	var BoardView = require('view/BoardView'),
		DicePanelView = require('view/DicePanelView'),
		PiecesPanelView = require('view/PiecesPanelView'),
		WelcomeModalView = require('view/WelcomeModalView'),
		HistoryPanelView = require('view/HistoryPanelView');

	return Backbone.View.extend({

		initialize: function () {
			this.buildDom();
			this.welcome();
		},


		welcome: function () {
			var welcomeModalView = new WelcomeModalView();
			welcomeModalView.show();
		},


		buildDom: function () {
			this.buildBoard();
			this.buildDicePanel();
			this.buildPiecesPanel();
			this.buildHistoryPanel();
		},


		buildBoard: function () {
			var boardView = new BoardView({el: $('#app-wrapper')});
			boardView.render();
		},


		buildDicePanel: function () {
			var dicePanelView = new DicePanelView({el: $('#app-wrapper')});
			dicePanelView.render();
		},


		buildPiecesPanel: function () {
			var piecesPanelView = new PiecesPanelView({el: $('#app-wrapper')});
			piecesPanelView.render();
		},
		

		buildHistoryPanel: function () {
			var historyPanelView = new HistoryPanelView({el: $('#app-wrapper')});
			historyPanelView.render();

			GLOBAL.historyPanelView = historyPanelView;
		}

	});

});