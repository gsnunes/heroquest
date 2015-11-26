define([

	'text!template/PieceView.html',
	'view/CharPopoverView',
	'view/PiecePopoverView',
	'view/MonsterPopoverView'

], function (html, CharPopoverView, PiecePopoverView, MonsterPopoverView) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		className: 'piece',


		events: {
			'mouseup': 'rotatePiece',
			'shareUpdateAvatar': 'shareUpdateAvatar',
			'shareOpenDoor': 'shareOpenDoor'
		},


		initialize: function () {
			this.bindEvents();
		},


		bindEvents: function () {
			gapi.hangout.data.onStateChanged.add(_.bind(function (ev) {
				if (ev.addedKeys.length && ev.addedKeys[0].key.match(/piece/gi)) {
					if (this.id === ev.addedKeys[0].key) {
						var state = JSON.parse(ev.state[ev.addedKeys[0].key]);

						this.model = state.model;

						this.setPosition(state.position, state.localParticipant);
						this.setRotateCss(state.rotation);
						this.setAvatar(state.avatar);
						this.setIcon();
					}
				}
			}, this));
		},


		/**
		 * setAvatar
		 */
		setAvatar: function (data) {
			if (data) {
				this.showProfilePicture(data);
			}
		},


		showProfilePicture: function (data) {
			if (data.show) {
				this.$el.find('i').css('opacity', data.opacity);
				this.$el.css({
					'background-image': 'url(' + data.profilePicture + ')',
					'background-size': (this.$el.width() + 'px ' + this.$el.height() + 'px')
				});
				this.$el.addClass('img-circle');
			}
			else {
				this.$el.find('i').css('opacity', data.opacity);
				this.$el.css({
					'background-image': 'none',
					'background-size': 'auto'
				});
				this.$el.removeClass('img-circle');
			}
		},


		afterRender: function () {
			this.setIcon();
			this.createPopover();
			this.setDraggable();
			this.setPosition();
			this.setRotateCss(this.rotation);
			this.setZIndex();
		},


		setIcon: function () {
			if (this.model && this.model.character) {
				this.$('i').attr('class', 'sprite-characters icon-' + this.model.character);
			}
			else {
				console.log(this.model.className);
				this.$('i').attr('class', this.model.className);
			}
		},


		shareOpenDoor: function (ev, data) {
			this.model.className = data.openDoor.className;
			gapi.hangout.data.setValue(this.id, JSON.stringify({id: this.id, position: {offsetX: parseFloat(this.$el.css('left')), offsetY: parseFloat(this.$el.css('top'))}, model: this.model, adjustedPosition: true, rotation: this.rotation, localParticipant: gapi.hangout.getLocalParticipant()}));
		},


		shareUpdateAvatar: function (ev, data) {
			gapi.hangout.data.setValue(this.id, JSON.stringify({id: this.id, position: {offsetX: parseFloat(this.$el.css('left')), offsetY: parseFloat(this.$el.css('top'))}, model: this.model, adjustedPosition: true, rotation: this.rotation, localParticipant: gapi.hangout.getLocalParticipant(), avatar: data.avatar}));
		},


		setZIndex: function () {
			if (this.model && this.model.movement) {
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
			var recoupLeft, recoupTop;

			if (this.$el.draggable('instance')) {
				this.$el.draggable('destroy');
			}
			
			this.$el.draggable({
				containment: '.board',
				start: function (event, ui) {
					var left = parseInt($(this).css('left'), 10),
						top = parseInt($(this).css('top'), 10);

					left = isNaN(left) ? 0 : left;
					top = isNaN(top) ? 0 : top;
					recoupLeft = left - ui.position.left;
					recoupTop = top - ui.position.top;

					$(this).popover('hide');
				},
				drag: function (event, ui) {
					ui.position.left += recoupLeft;
					ui.position.top += recoupTop;
				},
				stop: _.bind(this.stopDraggable, this)
			});
		},


		stopDraggable: function () {
			gapi.hangout.data.setValue(this.id, JSON.stringify({id: this.id, position: {offsetX: parseFloat(this.$el.css('left')), offsetY: parseFloat(this.$el.css('top'))}, model: this.model, adjustedPosition: true, rotation: this.rotation, localParticipant: gapi.hangout.getLocalParticipant()}));
		},


		setPosition: function (position, localParticipant) {
			if (this.$el.is(':visible') && localParticipant && localParticipant.id !== gapi.hangout.getLocalParticipant().id) {
				this.$el.popover('hide');
			}

			this.$el.css({
				left: position ? position.offsetX : this.adjustedPosition ? this.position.offsetX : (this.position.offsetX - (this.$el.width() / 2)),
				top: position ? position.offsetY : this.adjustedPosition ? this.position.offsetY : (this.position.offsetY - (this.$el.height() / 2))
			});
		},


		createPopover: function () {
			if (this.model && this.model.character) {
				new CharPopoverView({id: 'popover-' + this.id.substr(6), selector: this.$el});
			}
			else if (this.model && this.model.movement) {
				new MonsterPopoverView({id: 'popover-' + this.id.substr(6), selector: this.$el, model: this.model});
			}
			else {
				new PiecePopoverView({id: 'popover-' + this.id.substr(6), selector: this.$el, model: this.model});
			}
		},


		rotatePiece: function (ev) {
			this.rotation = typeof this.rotation === 'undefined' ? 0 : this.rotation;

			if (ev.button === 2) {
				this.rotation = this.rotation === 360 ? 90 : (this.rotation + 90);
				gapi.hangout.data.setValue(this.id, JSON.stringify({id: this.id, position: {offsetX: parseFloat(this.$el.css('left')), offsetY: parseFloat(this.$el.css('top'))}, model: this.model, adjustedPosition: true, rotation: this.rotation}));

				return false;
			}

			return true;
		},


		setRotateCss: function (rotation) {
			if (rotation) {
				this.$el.css({
					'-webkit-transform': 'rotate(' + rotation + 'deg)',
					'-moz-transform': 'rotate(' + rotation + 'deg)',
					'-ms-transform': 'rotate(' + rotation + 'deg)',
					'transform': 'rotate(' + rotation + 'deg)'
				});
			}
		}

	});

});