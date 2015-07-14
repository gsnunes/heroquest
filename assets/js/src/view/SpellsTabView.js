define([

	'text!template/SpellsTabView.html',
	'view/component/TabButtonComponentView',
	'view/SpellsTabButtonView'

], function (html, TabButtonComponentView, SpellsTabButtonView) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		afterRender: function () {
			this.createTabButtons();
		},


		createTabButtons: function () {
			var tabButtonComponent = new TabButtonComponentView(),
				chaosSpellsTabButtonView = new SpellsTabButtonView({type: 'chaos'}),
				airSpellsTabButtonView = new SpellsTabButtonView({type: 'air'});
				
			tabButtonComponent.attachTo(this);

			tabButtonComponent.add('Chaos', chaosSpellsTabButtonView, true);
			tabButtonComponent.add('Air', airSpellsTabButtonView);
		}

	});

});