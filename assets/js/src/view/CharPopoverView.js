define([

	'text!template/CharPopoverView.html',
	'collection/CharCollection',
	'view/component/ConfirmModalView'

], function (html, CharCollection, ConfirmModalView) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		serialize: function () {
			var value = gapi.hangout.data.getValue(this.id);
			return value ? JSON.parse(value) : this.model.toJSON();
		},


		events: {
			'click .glyphicon': 'changeProgress',
			'blur textarea': 'save',
			'change input': 'save',
			'click .btn-danger': 'removePiece'
		},


		initialize: function () {
			this.bindEvents();
			this.getModel();
		},


		getModel: function () {
			var charCollection = new CharCollection();

			charCollection.fetch({
				success: _.bind(function () {
					this.model = charCollection.get(this.id.substr(8));
					this.setPopover();
				}, this)
			});
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
						myPopover.options.title = _this.model.attributes.name + ' (' + _this.model.attributes.character + ')';
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
			if (this.model.attributes.personId !== GLOBAL.participant.person.id) {
				this.$('.btn-danger').off('click').remove();
				this.$('.glyphicon').off('click').remove();
				this.$('textarea').prop('disabled', true);
				this.$('input').prop('disabled', true);
			}
		},


		bindEvents: function () {
			gapi.hangout.data.onStateChanged.add(_.bind(function (ev) {
				if (ev.addedKeys.length && ev.addedKeys[0].key.match(/popover/gi)) {
					if (this.id === ev.addedKeys[0].key) {
						this.render();
					}
				}
			}, this));
		},
		

		changeProgress: function (ev) {
			var progressBar = $(ev.target).parents('.progress-wrapper').find('.progress-bar'),
				valueNow = parseInt(progressBar.attr('aria-valuenow'), 10),
				valueMin = parseInt(progressBar.attr('aria-valuemin'), 10),
				valueMax = parseInt(progressBar.attr('aria-valuemax'), 10),
				newValue = $(ev.target).attr('class') === 'glyphicon glyphicon-minus' ? (valueNow - 1) : (valueNow + 1),
				newWidth = (newValue * 100) / (progressBar.hasClass('progress-bar-info') ? this.model.attributes.mind : this.model.attributes.body);

			if (newValue >= valueMin && newValue <= valueMax) {
				progressBar.html(newValue);
				progressBar.width(newWidth + '%');
				progressBar.attr('aria-valuenow', newValue);
				
				gapi.hangout.data.setValue(this.id, JSON.stringify(this.getDataFromForm(true)));
			}
		},


		getDataFromForm: function (share) {
			var data = this.$('form').serializeObject();

			if (share) {
				data.bodyNow = parseInt(this.$('.progress-bar-danger').html(), 10);
				data.mindNow = parseInt(this.$('.progress-bar-info').html(), 10);
			}

			return data;
		},


		save: function () {
			this.model.save(this.getDataFromForm(), {
				success: _.bind(function () {
					gapi.hangout.data.setValue(this.id, JSON.stringify(this.getDataFromForm(true)));
				}, this)
			});
		},


		removePiece: function () {
			var newModal = new ConfirmModalView({type: 'danger', body: 'Do you really want to remove this piece ?', callback: _.bind(function () {
				this.selector.popover('destroy');
				gapi.hangout.data.clearValue(this.selector.attr('id'));

				newModal.close();
			}, this)});
			newModal.open();
		}

	});

});