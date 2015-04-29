define(function (require) {
 
	"use strict";

	var BoardView = require('view/BoardView'),
		DicePanelView = require('view/DicePanelView'),
		PiecesPanelView = require('view/PiecesPanelView'),
		WelcomeModalView = require('view/WelcomeModalView'),
		HistoryPanelView = require('view/HistoryPanelView');

	return Giraffe.App.extend({

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
			var boardView = new BoardView({el: $('.wrapper')});
			boardView.render();
		},


		buildDicePanel: function () {
			var dicePanelView = new DicePanelView({el: $('.wrapper')});
			dicePanelView.render();
		},


		buildPiecesPanel: function () {
			var piecesPanelView = new PiecesPanelView({el: $('.wrapper')});
			piecesPanelView.render();
		},
		

		buildHistoryPanel: function () {
			var historyPanelView = new HistoryPanelView({el: $('.wrapper')});
			historyPanelView.render();

			GLOBAL.historyPanelView = historyPanelView;
		}

	});

});