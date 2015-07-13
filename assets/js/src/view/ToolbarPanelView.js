define([

	'text!template/ToolbarPanelView.html',
	'view/component/NewPanelView',
	'view/component/TabComponentView',
	'view/PiecesTabView',
	'view/SpellsTabView'

], function (html, NewPanelView, TabComponentView, PiecesTabView, SpellsTabView) {

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
				spellsTabView = new SpellsTabView(),
				unselectPieces = function () {
					monsterPiecesTabView.unselect();
					furniturePiecesTabView.unselect();
					tilePiecesTabView.unselect();
				};
				
			tabComponent.attachTo(this.$('.panel-body'));

			tabComponent.add('Monsters', monsterPiecesTabView, true, function () {
				unselectPieces();
			});

			tabComponent.add('Furnitures', furniturePiecesTabView, null, function () {
				unselectPieces();
			});

			tabComponent.add('Tiles', tilePiecesTabView, null, function () {
				unselectPieces();
			});

			tabComponent.add('Spells', spellsTabView, null, function () {
				unselectPieces();
			});
		}

	});

});