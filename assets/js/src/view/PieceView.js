define([

	'text!template/PieceView.html',
	'view/CharPopoverView'

], function (html, CharPopoverView) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		className: 'piece',


		initialize: function () {
			this.bindEvents();
		},


		bindEvents: function () {
			gapi.hangout.data.onStateChanged.add(_.bind(function (ev) {
				if (ev.addedKeys.length && ev.addedKeys[0].key.match(/piece/gi)) {
					if (this.id === ev.addedKeys[0].key) {
						this.setPosition(JSON.parse(ev.state[ev.addedKeys[0].key]));
					}
				}
			}, this));
		},


		afterRender: function () {
			this.$('i').addClass('sprite-characters icon-' + this.model.character);

			this.createPopover();
			this.setDraggable();

			if (this.ev) {
				this.setPosition();
			}
		},


		setDraggable: function () {
			this.$el.draggable({
				containment: '.board',
				start: this.startDraggable,
				stop: this.stopDraggable
			});
		},


		startDraggable: function () {
			$(this).popover('hide');
		},


		stopDraggable: function () {
			gapi.hangout.data.setValue(this.id, JSON.stringify({offsetX: parseInt($(this).css('left'), 10), offsetY: parseInt($(this).css('top'), 10)}));
		},


		setPosition: function (data) {
			this.$el.popover('hide');

			this.$el.css({
				left: data ? data.offsetX : (this.ev.offsetX - (this.$el.width() / 2)),
				top: data ? data.offsetY : (this.ev.offsetY - (this.$el.height() / 2))
			});
		},


		createPopover: function () {
			new CharPopoverView({id: 'popover-' + this.id.substr(6), selector: this.$el});
		}

	});

});