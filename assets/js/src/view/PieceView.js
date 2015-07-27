define([

	'text!template/PieceView.html',
	'view/CharPopoverView',
	'view/MonsterPopoverView'

], function (html, CharPopoverView, MonsterPopoverView) {

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
						this.setPosition(JSON.parse(ev.state[ev.addedKeys[0].key]).position);
					}
				}
			}, this));
		},


		afterRender: function () {
			if (this.model && this.model.character) {
				this.$('i').addClass('sprite-characters icon-' + this.model.character);
			}
			else {
				this.$('i').addClass(this.model.className);
			}

			this.createPopover();
			this.setDraggable();
			this.setPosition();
			this.setZIndex();
		},


		setZIndex: function () {
			if (this.model && this.model.moviment) {
				this.$el.css('z-index', 1);
			}
			else if (this.model && this.model.character) {
				this.$el.css('z-index', 2);
			}
			else {
				this.$el.css('z-index', 0);
			}
		},


		setDraggable: function () {
			this.$el.draggable({
				containment: '.board',
				start: this.startDraggable,
				stop: _.bind(this.stopDraggable, this)
			});
		},


		startDraggable: function () {
			$(this).popover('hide');
		},


		stopDraggable: function () {
			gapi.hangout.data.setValue(this.id, JSON.stringify({id: this.id, position: {offsetX: parseFloat(this.$el.css('left')), offsetY: parseFloat(this.$el.css('top'))}, model: this.model, adjustedPosition: true}));
		},


		setPosition: function (position) {
			this.$el.popover('hide');

			this.$el.css({
				left: position ? position.offsetX : this.adjustedPosition ? this.position.offsetX : (this.position.offsetX - (this.$el.width() / 2)),
				top: position ? position.offsetY : this.adjustedPosition ? this.position.offsetY : (this.position.offsetY - (this.$el.height() / 2))
			});
		},


		createPopover: function () {
			if (this.model && this.model.character) {
				new CharPopoverView({id: 'popover-' + this.id.substr(6), selector: this.$el});
			}
			else if (this.model && this.model.moviment) {
				new MonsterPopoverView({id: 'popover-' + this.id.substr(6), selector: this.$el, model: this.model});
			}
		}

	});

});