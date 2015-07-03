define([

	'text!template/ToolbarPanelView.html',
	'view/component/NewPanelView',
	'view/component/TabComponentView',
	'view/MonsterPiecesTabView',
	'view/FurniturePiecesTabView'

], function (html, NewPanelView, TabComponentView, MonsterPiecesTabView, FurniturePiecesTabView) {

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
				monsterPiecesTabView = new MonsterPiecesTabView(),
				furniturePiecesTabView = new FurniturePiecesTabView();
				
			tabComponent.attachTo(this.$('.panel-body'));

			tabComponent.add('Monsters', monsterPiecesTabView, true, function () {
				monsterPiecesTabView.unselect();
				furniturePiecesTabView.unselect();
			});

			tabComponent.add('Furnitures', furniturePiecesTabView, null, function () {
				monsterPiecesTabView.unselect();
				furniturePiecesTabView.unselect();
			});
		}

	});

});