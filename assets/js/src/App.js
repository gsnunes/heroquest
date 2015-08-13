define(function (require) {
 
	"use strict";

	var BoardView = require('view/NewBoardView'),
		TreasureView = require('view/TreasureView'),
		DicePanelView = require('view/DicePanelView'),
		PiecesPanelView = require('view/ToolbarPanelView'),
		WelcomeModalView = require('view/WelcomeModalView'),
		HistoryPanelView = require('view/HistoryPanelView');

	return Giraffe.App.extend({

		id: 'app-wrapper',
		

		initialize: function () {
			this.bindEvents();

			/*
			var my_dictionary = {
				'some text': 'a translation',
				'some more text': 'another translation'
			};

			$.i18n.load(my_dictionary);
			*/
		},


		bindEvents: function () {
			gapi.hangout.data.onStateChanged.add(_.bind(function (ev) {
				if (ev.addedKeys.length && ev.addedKeys[0].key.match(/master/gi)) {
					this.buildDom();
				}
			}, this));


			gapi.hangout.onParticipantsRemoved.add(function (ev) {
				if (ev.removedParticipants && ev.removedParticipants.length) {
					var master = util.getMaster(),
						participants = gapi.hangout.getParticipants();

					if (ev.removedParticipants[0].person.id === master.person.id) {
						gapi.hangout.data.setValue('master', JSON.stringify(participants[0]));
					}
				}
			});
		},


		afterRender: function () {
			var participant = gapi.hangout.getLocalParticipant(),
				master = util.getMaster();

			if (master) {
				this.buildDom();
			}
			else {
				gapi.hangout.data.setValue('master', JSON.stringify(participant));
			}

			this.shuffleTreasures();
			this.welcome();
		},


		shuffleTreasures: function () {
			var treasureView = new TreasureView();
			treasureView.attachTo(this);
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