define([

	'view/component/TabButtonComponentView',
	'view/SpellsTabButtonView',
	'view/ArtifactsTabButtonView',
	'view/TreasuresTabButtonView'

], function (TabButtonComponentView, SpellsTabButtonView, ArtifactsTabButtonView, TreasuresTabButtonView) {

	'use strict';

	return Giraffe.View.extend({

		afterRender: function () {
			this.createTabButtons();
		},


		createTabButtons: function () {
			var tabButtonComponent = new TabButtonComponentView(),
				spells = _.groupBy(GLOBAL.data.spell, 'type');

			tabButtonComponent.attachTo(this);

			if (GLOBAL.displayIndex === 0) {
				tabButtonComponent.add('Chaos', new SpellsTabButtonView({data: spells.chaos}), true);
				tabButtonComponent.add('Artifacts', new ArtifactsTabButtonView({data: GLOBAL.data.artifact}));
				tabButtonComponent.add('Treasures', new TreasuresTabButtonView({data: GLOBAL.data.treasure}));
			}

			if (GLOBAL.displayIndex === 1) {
				tabButtonComponent.add('Air', new SpellsTabButtonView({data: spells.air}), true);
				tabButtonComponent.add('Earth', new SpellsTabButtonView({data: spells.earth}));
				tabButtonComponent.add('Fire', new SpellsTabButtonView({data: spells.fire}));
				tabButtonComponent.add('Water', new SpellsTabButtonView({data: spells.water}));
			}
		}

	});

});