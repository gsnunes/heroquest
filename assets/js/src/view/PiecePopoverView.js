define([

	'text!template/PiecePopoverView.html'

], function (html) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		serialize: function () {
			var value = gapi.hangout.data.getValue(this.id);
			return value ? JSON.parse(value) : this.model;
		},


		events: {
			'click .btn-danger': 'removePiece'
		},


		initialize: function () {
			// fix to prevent click event after draggable
			setTimeout(_.bind(function () {
				if (GLOBAL.displayIndex === 0) {
					this.setPopover();
				}
			}, this));
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
			this.selector.popover('destroy');
			gapi.hangout.data.clearValue(this.selector.attr('id'));
		}

	});

});