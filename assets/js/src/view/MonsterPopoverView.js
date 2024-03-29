define([

	'text!template/MonsterPopoverView.html',
	'view/component/ConfirmModalView'

], function (html, ConfirmModalView) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		serialize: function () {
			return this.getValue();
		},


		getValue: function () {
			var value = gapi.hangout.data.getValue(this.id);
			return value ? JSON.parse(value) : this.model;
		},


		events: {
			'click .glyphicon': 'changeProgress',
			'change input': 'save',
			'click .btn-danger': 'removePiece'
		},


		initialize: function () {
			var value = gapi.hangout.data.getValue(this.id);
			this.value ? JSON.parse(value) : this.model

			this.bindEvents();

			// fix to prevent click event after draggable
			setTimeout(_.bind(function () {
				this.setPopover();
				this.setTooltip();
			}, this));
		},


		bindEvents: function () {
			gapi.hangout.data.onStateChanged.add(_.bind(function (ev) {
				if (ev.addedKeys.length && ev.addedKeys[0].key.match(/popover/gi)) {
					if (this.id === ev.addedKeys[0].key) {
						this.render();
						this.setTooltip(this.getDataFromForm(true));
					}
				}
			}, this));
		},


		setTooltip: function (shareData) {
			var data = this.getValue();
			data = $.extend(data, shareData || {});

			this.selector.find('i').attr('data-original-title', (data.name + ' (movement: ' + data.movement + ', attack: ' + data.attack + ', defense: ' + data.defense + ', body: ' + (data.bodyNow || data.body) + ', mind: ' + (data.mindNow || data.mind) + ')'));
			this.selector.find('i').tooltip('fixTitle');
		},


		setPopover: function () {
			var _this = this,
				load = false;

			//404x279
			this.selector.popover({trigger: 'manual', html: true, placement: 'auto'}).click(function () {
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


		afterRender: function () {
			this.lockInputs();
		},


		lockInputs: function () {
			if (!util.isMaster()) {
				this.$('.btn-danger').off('click').remove();
				this.$('.glyphicon').off('click').remove();
				this.$('input').prop('disabled', true);
			}
		},


		changeProgress: function (ev) {
			var progressBar = $(ev.target).parents('.progress-wrapper').find('.progress-bar'),
				valueNow = parseInt(progressBar.attr('aria-valuenow'), 10),
				valueMin = parseInt(progressBar.attr('aria-valuemin'), 10),
				valueMax = parseInt(progressBar.attr('aria-valuemax'), 10),
				newValue = $(ev.target).attr('class') === 'glyphicon glyphicon-minus' ? (valueNow - 1) : (valueNow + 1),
				newWidth = (newValue * 100) / (progressBar.hasClass('progress-bar-info') ? this.model.mind : this.model.body);

			if (newValue >= valueMin && newValue <= valueMax) {
				progressBar.html(newValue);
				progressBar.width(newWidth + '%');
				progressBar.attr('aria-valuenow', newValue);

				gapi.hangout.data.setValue(this.id, JSON.stringify(this.getDataFromForm(true)));
			}
		},


		getDataFromForm: function (share) {
			var data = this.$('form').serializeObject();

			data.name = this.model.name;
			data.className = this.model.className;

			if (share) {
				data.bodyNow = parseInt(this.$('.progress-bar-danger').html(), 10);
				data.mindNow = parseInt(this.$('.progress-bar-info').html(), 10);
			}

			return data;
		},


		save: function () {
			gapi.hangout.data.setValue(this.id, JSON.stringify(this.getDataFromForm(true)));
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
