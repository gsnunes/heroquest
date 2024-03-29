define([

	'text!template/ToolbarPanelView.html',
	'view/component/NewPanelView',
	'view/component/TabComponentView',
	'view/PiecesTabView',
	'view/CardsTabView',
	'view/SettingsTabView',
	'view/JukeboxTabView'

], function (html, NewPanelView, TabComponentView, PiecesTabView, CardsTabView, SettingsTabView, JukeboxTabView) {

	'use strict';

	return NewPanelView.extend({

		template: html,


		className: 'toolbar-panel',


		events: function () {
			return _.extend({}, NewPanelView.prototype.events, {});
		},


		initialize: function () {
			GLOBAL.toolbar = {};
		},


		afterRender: function () {
			NewPanelView.prototype.afterRender.apply(this, arguments);
			this.setTitle('Toolbar');
			this.createTabs();
		},


		createTabs: function () {
			var tabComponent = new TabComponentView(),
				monsterPiecesTabView = new PiecesTabView({type: 'monster'}),
				furniturePiecesTabView = new PiecesTabView({type: 'furniture'}),
				tilePiecesTabView = new PiecesTabView({type: 'tile'}),
				cardsTabView = new CardsTabView(),
				settingsTabView = new SettingsTabView(),
				jukeboxTabView = new JukeboxTabView(),
				unselectPieces = function () {
					monsterPiecesTabView.unselect();
					furniturePiecesTabView.unselect();
					tilePiecesTabView.unselect();
				},
				isMaster = util.isMaster();
				
			tabComponent.attachTo(this.$('.panel-body'));

			if (isMaster) {
				tabComponent.add('Monsters', monsterPiecesTabView, true, function () {
					unselectPieces();
				});

				tabComponent.add('Furnitures', furniturePiecesTabView, null, function () {
					unselectPieces();
				});

				tabComponent.add('Tiles', tilePiecesTabView, null, function () {
					unselectPieces();
				});
			}

			tabComponent.add('Cards', cardsTabView, (isMaster ? null : true), function () {
				unselectPieces();
			});

			tabComponent.add('Jukebox', jukeboxTabView, false, function () {
				unselectPieces();
			});

			tabComponent.add('Settings', settingsTabView, false, function () {
				unselectPieces();
			});
		}

	});

});