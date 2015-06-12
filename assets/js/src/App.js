define(function (require) {
 
	"use strict";

	var BoardView = require('view/BoardView'),
		DicePanelView = require('view/DicePanelView'),
		PiecesPanelView = require('view/PiecesPanelView'),
		WelcomeModalView = require('view/WelcomeModalView'),
		HistoryPanelView = require('view/HistoryPanelView');

	return Giraffe.App.extend({

		initialize: function () {
			var my_dictionary = {
				'some text': 'a translation',
				'some more text': 'another translation'
			};

			$.i18n.load(my_dictionary);
			

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
			var boardView = new BoardView();
			boardView.attachTo('#app-wrapper');
		},


		buildDicePanel: function () {
			var dicePanelView = new DicePanelView();
			dicePanelView.attachTo('#app-wrapper');
		},


		buildPiecesPanel: function () {
			var piecesPanelView = new PiecesPanelView();
			piecesPanelView.attachTo('#app-wrapper');
		},
		

		buildHistoryPanel: function () {
			var historyPanelView = new HistoryPanelView({el: $('#app-wrapper')});
			historyPanelView.render();

			GLOBAL.historyPanelView = historyPanelView;
		}

	});

});