define(function (require) {
 
	"use strict";

	var BoardView = require('view/NewBoardView'),
		DicePanelView = require('view/DicePanelView'),
		PiecesPanelView = require('view/ToolbarPanelView'),
		WelcomeModalView = require('view/WelcomeModalView'),
		HistoryPanelView = require('view/HistoryPanelView');

	return Giraffe.App.extend({

		id: 'app-wrapper',
		

		initialize: function () {
			/*
			var my_dictionary = {
				'some text': 'a translation',
				'some more text': 'another translation'
			};

			$.i18n.load(my_dictionary);
			*/
		},


		afterRender: function () {
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
			boardView.attachTo(this);
		},


		buildDicePanel: function () {
			var dicePanelView = new DicePanelView();
			dicePanelView.attachTo(this);
		},


		buildPiecesPanel: function () {
			var piecesPanelView = new PiecesPanelView();
			piecesPanelView.attachTo(this);
		},
		

		buildHistoryPanel: function () {
			var historyPanelView = new HistoryPanelView();
			historyPanelView.attachTo(this);

			GLOBAL.historyPanelView = historyPanelView;
		}

	});

});