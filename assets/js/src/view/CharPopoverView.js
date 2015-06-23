define([

	'text!template/CharPopoverView.html',
	'view/component/PopoverView'

], function (Template, PopoverView) {

	'use strict';

	return PopoverView.extend({

		template: _.template(Template),


		events: {
			'click .glyphicon-minus, .glyphicon-plus': 'changeProgress'
		},


		initialize: function (options) {
			this.options = options;

			this.options.selector = '#' + options.key;
			this.options.html = true;
			this.setContent();
			this.setTitle();
		},


		setContent: function () {
			var monster = this.options.monster,
				attr = {
					moviment: monster.attr.mo,
					attack: monster.attr.a,
					defense: monster.attr.d,
					body: monster.attr.b,
					mind: monster.attr.m
				},
				div;

			if (!this.cache) {
				div = document.createElement('div');
				div.innerHTML = this.template({
					attr: attr
				});

				this.cache = div;
			}

			this.options.content = this.cache;
		},


		setTitle: function () {
			this.options.title = this.options.monster.title || (this.options.monster.name + ' - ' + this.options.monster.character);
		},
		

		changeProgress: function (ev) {
			var progressBar = $(ev.target).parents('.progress-wrapper').find('.progress-bar'),
				valueNow = parseInt(progressBar.attr('aria-valuenow'), 10),
				valueMin = parseInt(progressBar.attr('aria-valuemin'), 10),
				valueMax = parseInt(progressBar.attr('aria-valuemax'), 10),
				newValue = $(ev.target).attr('class') === 'glyphicon glyphicon-minus' ? (valueNow - 1) : (valueNow + 1),
				newWidth = (newValue * 100) / (progressBar.hasClass('progress-bar-info') ? this.options.monster.attr.m : this.options.monster.attr.b);

			if (newValue >= valueMin && newValue <= valueMax) {
				progressBar.html(newValue);
				progressBar.width(newWidth + '%');
				progressBar.attr('aria-valuenow', newValue);
			}

			gapi.hangout.data.setValue('popover-' + this.$el.attr('id'), $('<div>').append(progressBar.clone()).html());
		}

	});

});