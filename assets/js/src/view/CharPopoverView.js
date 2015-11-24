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
			'change input[type="number"]': 'save',
			'click .glyphicon': 'changeProgress',
			'blur textarea': 'save'
		},


		initialize: function () {
			this.bindEvents();
			this.getModel();
		},


		showProfilePicture: function (ev, level) {
			if ($(ev.target).is(':checked')) {
				level.val(0);
				level.prop('disabled', false);

				this.selector.find('i').css('opacity', '0');
				this.selector.css({
					'background-image': 'url(' + gapi.hangout.getLocalParticipant().person.image.url + ')',
					'background-size': (this.selector.width() + 'px ' + this.selector.height() + 'px')
				});
				this.selector.addClass('img-circle');
			}
			else {
				level.val(1);
				level.prop('disabled', true);

				this.selector.find('i').css('opacity', '1');
				this.selector.css({
					'background-image': 'none',
					'background-size': 'auto'
				});
				this.selector.removeClass('img-circle');
			}
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
						myPopover.options.title = _this.model.attributes.name + ' (' + _this.model.attributes.character + ') <div class="btn-group pull-right"> <button type="button" class="close dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <span class="glyphicon glyphicon-cog"></span> </button> <ul class="dropdown-menu dropdown-menu-right"> <li><a href="#"><div class="checkbox"><label for="show-profile-picture"><input type="checkbox" name="show-profile-picture" id="show-profile-picture"> show profile picture</label></div></a></li> <li><a href="#"><label>transparency <select disabled>' + _this.getTransparencyOptions() + '</select></label></a></li> <li role="separator" class="divider"></li> <li></li> <li><a href="#" class="remove-piece">remove character</a></li> </ul> </div>';
						myPopover.setContent();
						load = true;
					}

					$(this).popover('show');
					_this.bindDropdown($(this).data('bs.popover').$tip);
				}
			});
		},


		getTransparencyOptions: function () {
			var value = '0',
				text = '0%',
				options = '',
				i = 0, len = 11;

			for (i = 0; i < len; i++) {
				if (i > 0 && i < 10) {
					value = '0.' + i;
					text = i + '0%';
				}
				else if (i === 10) {
					value = '1';
					text = '100%';
				}

				options += '<option value="' + value + '" ' + (i === 10 ? 'selected' : '') + '>' + text + '</option>';
			}

			return options;
		},


		bindDropdown: function ($popover) {
			var _this = this;

			$popover.find('h3 .dropdown-menu input, h3 .dropdown-menu label').on('click', function (ev) {
				ev.stopPropagation();
			});

			$popover.find('h3 .dropdown-menu input[type="checkbox"]').on('click', function (ev) {
				_this.showProfilePicture(ev, $popover.find('h3 .dropdown-menu select'));
				gapi.hangout.data.setValue(_this.selector.attr('id'), JSON.stringify({showProfilePicture: _this.selector.hasClass('img-circle'), opacity: _this.selector.find('i').css('opacity')}));
			});

			$popover.find('h3 .dropdown-menu select').on('change', function (ev) {
				_this.selector.find('i').css('opacity', $(this).val());
				gapi.hangout.data.setValue(_this.selector.attr('id'), JSON.stringify({showProfilePicture: _this.selector.hasClass('img-circle'), opacity: _this.selector.find('i').css('opacity')}));
			});

			$popover.find('h3 .remove-piece').on('click', function () {
				_this.removePiece();
			});


			$popover.find('h3 .dropdown-menu input[type="checkbox"]').prop('checked', this.selector.hasClass('img-circle'));
			$popover.find('h3 .dropdown-menu select').prop('disabled', !this.selector.hasClass('img-circle')).val(this.selector.find('i').css('opacity'));
		},


		afterRender: function () {
			this.lockInputs();
		},


		lockInputs: function () {
			if (this.model.attributes.personId !== gapi.hangout.getLocalParticipant().person.id) {
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
				gapi.hangout.data.clearValue(this.selector.attr('id'));
				newModal.close();
			}, this)});
			newModal.open();
		}

	});

});
