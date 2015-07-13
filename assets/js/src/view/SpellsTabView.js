define([

	'text!template/SpellsTabView.html'

], function (html) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		events: {
			'click label.btn': 'showContainer'
		},


		afterRender: function () {
			this.createList();
			this.populateList();
		},


		createList: function () {
			var data = _.groupBy(GLOBAL.data.spell, 'type'),
				buttons = [],
				lists = [],
				i = 0;

			_.each(data, function (value, index) {
				buttons.push('<label class="btn btn-primary ' + (i === 0 ? 'active' : '') + '"><input type="radio" id="option-' + index + '" autocomplete="off" ' + (i === 0 ? 'checked' : '') + '>' + index + '</label>');
				lists.push('<div class="list-group ' + (i === 0 ? '' : 'hide') + '" id="list-group-option-' + index + '"></div>');
				i++;
			});

			this.$('.btn-group').html(buttons.join(''));
			this.$('.list-group-container').html(lists.join(''));
		},


		populateList: function () {
			var data = GLOBAL.data.spell;

			_.each(data, _.bind(function (value) {
				this.$('#list-group-option-' + value.type).append('<a href="#" class="list-group-item"><h4 class="list-group-item-heading">' + value.name + '</h4><p class="list-group-item-text">...</p></a>');
			}, this));
		},


		showContainer: function (ev) {
			this.$('.list-group').addClass('hide');
			this.$('#list-group-' + $(ev.target).find('input').attr('id')).removeClass('hide');
		}

	});

});