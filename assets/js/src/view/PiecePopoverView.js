define([

	'text!template/PiecePopoverView.html',
	'view/component/ConfirmModalView'

], function (html, ConfirmModalView) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		serialize: function () {
			var value = gapi.hangout.data.getValue(this.id);
			return value ? JSON.parse(value) : this.model;
		},


		events: {
			'click .btn-danger': 'removePiece',
			'click .openDoor': 'openDoor'
		},


		initialize: function () {
			// fix to prevent click event after draggable
			setTimeout(_.bind(function () {
				if (util.isMaster()) {
					this.setPopover();
				}
			}, this));
		},


		afterRender: function () {
			if (this.selector.find('i').hasClass('icon-door') || this.selector.find('i').hasClass('icon-door-opened')) {
				this.$el.prepend('<button type="button" class="btn btn-block openDoor" style="margin-bottom: 10px">open/close door</button>');
			}
		},


		/**
		 * openDoor
		 */
		openDoor: function () {
			this.selector.trigger('shareOpenDoor', [{openDoor: {className: ((this.selector.find('i').hasClass('icon-door')) ? 'sprite-furnitures icon-door-opened' : 'sprite-furnitures icon-door')}}]);
		},


		setPopover: function () {
			var _this = this,
				load = false;

			this.selector.popover({trigger: 'manual', html: true, placement: 'top'}).click(function () {
				if ($(this).attr('aria-describedby')) {
					$(this).popover('hide');
				}
				else {
					if (!load) {
						var myPopover = $(this).data('bs.popover');
						myPopover.options.content = _this.render().el;
						myPopover.options.title = _this.model.name;
						myPopover.setContent();
						load = true;
					}

					$(this).popover('show');
				}
			});
		},


		removePiece: function () {
			var newModal = new ConfirmModalView({type: 'danger', body: 'Do you really want to remove this piece ?', callback: _.bind(function () {
				gapi.hangout.data.clearValue(this.selector.attr('id'));
				newModal.close();
			}, this)});
			newModal.open();
		}

	});

});
