define([

	'text!template/CampaignListModalView.html',
	'view/component/NewModalView',
	'view/CampaignFormModalView',
	'collection/CampaignCollection',
	'view/component/ListGroupView',
	'view/component/ButtonView',
	'view/component/ButtonToolbarView',
	'view/component/ConfirmModalView',
	'clipboard'

], function (html, NewModalView, CampaignFormModalView, CampaignCollection, ListGroupView, ButtonView, ButtonToolbarView, ConfirmModalView, Clipboard) {

	'use strict';

	return NewModalView.extend({

		template: html,


		events: {
			'click .add-campaign': function () {
				this.checkUrlCampaign(_.bind(function (result) {
					if (!result.length && util.isMaster()) {
						this.addCampaign();
					}
				}, this));
			}
		},


		campaignCollection: new CampaignCollection(),


		initialize: function () {
			NewModalView.prototype.initialize.apply(this, arguments);
			this.token = gapi.auth.getToken('token', true);
		},


		afterRender: function () {
			this.$('.new-instance').attr('href', 'https://' + util.getHost());

			var clipboard = new Clipboard('.copy-url');

			this.createListGroup();
			this.getData();
		},


		checkUrlCampaign: function (callback) {
			var campaignCollection = new CampaignCollection(),
				url = gapi.hangout.getHangoutUrl(),
				_this = this;

			util.loadShow(this);

			campaignCollection.fetch({
				data: {url: url},
				success: function (result) {
					if (!result.length && util.isMaster()) {
						_this.$('.alert-info').addClass('hide');
						_this.$('.alert-success').removeClass('hide');
						_this.$('.btn-success').prop('disabled', false);
						_this.$('.current-campaign-list-group').addClass('hide');
					}
					else {
						if (util.isMaster()) {
							_this.$('.alert-info').removeClass('hide');
							_this.$('.alert-success').addClass('hide');
							_this.$('.current-campaign-list-group').removeClass('hide');
							gapi.hangout.data.setValue('updateTitle', result.models[0].attributes.description);
						}
						else {
							_this.$('.alert-info').removeClass('hide');
							_this.$('.alert-success').addClass('hide');
						}

						_this.$('.btn-success').prop('disabled', true);
					}

					if (typeof callback === 'function') {
						callback(result);
					}

					util.loadHide(_this);
				}
			});
		},


		bindEvents: function () {
			NewModalView.prototype.bindEvents.apply(this, arguments);

			gapi.hangout.data.onStateChanged.add(_.bind(function (ev) {
				if (ev.addedKeys.length && ev.addedKeys[0].key.match(/master/gi)) {
					this.populateListGroup();
				}
			}, this));
		},


		createListGroup: function () {
			this.listGroupView = new ListGroupView({el: this.$('.campaign-list-group')});
			this.listGroupView.render();

			this.currentListGroupView = new ListGroupView({el: this.$('.current-campaign-list-group .current-list')});
			this.currentListGroupView.render();
		},


		getData: function () {
			var self = this;

			this.campaignCollection.fetch({
				data: {personId: gapi.hangout.getLocalParticipant().person.id},
				success: function () {
					self.campaignCollection.on('sync', function (model) {
						self.checkUrlCampaign();
						self.populateListGroup();
					});

					self.campaignCollection.on('change', self.populateListGroup, self);
					self.campaignCollection.on('remove', self.populateListGroup, self);
				}
			});
		},


		populateListGroup: function () {
			var self = this,
				hasCurrentCampaign = false;

			this.listGroupView.reset();
			this.currentListGroupView.reset();

			if (this.campaignCollection.length) {
				this.campaignCollection.forEach(function (model) {
					var listGroupItem,
						btnStart = new ButtonView({style: 'btn-primary', size: 'btn-xs', caption: 'Go to', icon: 'glyphicon glyphicon-share-alt', disabled: (model.attributes.url === gapi.hangout.getHangoutUrl())}),
						btnEdit = new ButtonView({style: 'btn-warning', size: 'btn-xs', caption: 'Edit', icon: 'glyphicon glyphicon-edit'}),
						btnRemove = new ButtonView({style: 'btn-danger', size: 'btn-xs', caption: 'Remove', icon: 'glyphicon glyphicon-remove'}),
						buttonToolbarView = new ButtonToolbarView(),
						buttons = util.isMaster() ? [btnRemove, btnEdit, btnStart] : [btnEdit, btnRemove],
						description = model.attributes.description;

					if (description && description.length > 100) {
						description = description.substr(0, 100) + '...';
					}

					if (model.attributes.url === gapi.hangout.getHangoutUrl()) {
						hasCurrentCampaign = true;
						self.$('#url').val(model.attributes.url);
						listGroupItem = self.currentListGroupView.addItem(model.attributes.name, description);
					}
					else {
						listGroupItem = self.listGroupView.addItem(model.attributes.name, description);
					}

					buttonToolbarView.addButtons(buttons);
					buttonToolbarView.addClass('pull-right');

					listGroupItem.append(buttonToolbarView.template());
					listGroupItem.append('<div class="clearfix"></div>');

					if (util.isMaster() && (model.attributes.url !== gapi.hangout.getHangoutUrl())) {
						$(listGroupItem).find('.btn-primary').on('click', function () {
							var newModal = new ConfirmModalView({type: 'warning', body: 'Do you really want to load <b>' + model.attributes.name + '</b> ? You will be redirect to the campaign URL.', callback: function () {
								window.parent.location = model.attributes.url + '?old=true';
							}});
							newModal.open();
						});
					}

					$(listGroupItem).find('.btn-warning').on('click', function (ev) {
						self.addCampaign(ev, model);
					});

					$(listGroupItem).find('.btn-danger').on('click', function () {
						var newModal = new ConfirmModalView({type: 'danger', body: 'Do you really want to remove <b>' + model.attributes.name + '</b> ?', callback: function () {
							if (gapi.hangout.data.getValue('campaign') === model.attributes.id.toString()) {
								gapi.hangout.data.clearValue('campaign');
							}

							model.destroy({success: function () {
								self.checkUrlCampaign();
							}});
							newModal.close();
						}});
						newModal.open();
					});
				});

				if (hasCurrentCampaign) {
					self.$('.current-campaign-list-group').removeClass('hide');
				}
				else {
					self.$('.current-campaign-list-group').addClass('hide');
				}

				this.$('.no-data').addClass('hide');
			}
			else {
				this.$('.no-data').removeClass('hide');
			}
		},


		start: function (model) {
			util.clearValue('campaign', 300, _.bind(function () {
				this.clearOldCampaign(model);
			}, this));
		},


		clearOldCampaign: function (model) {
			util.clearState();

			var interval = setInterval(_.bind(function () {
				var keys = gapi.hangout.data.getKeys();
				
				if (keys.length === 1) {
					clearInterval(interval);
					this.loadNewCampaign(model);
				}
			}, this), 300);
		},


		loadNewCampaign: function (model) {
			var total = _.keys(model.attributes.state).length,
				rounds = Math.floor(total / 10),
				currentRound = 0,
				_this = this,
				state = {},
				count = 0,
				i;
			
			util.setValue('campaign', model.attributes.id.toString(), 300, function () {
				if (_.keys(model.attributes.state).length) {
					for (i in model.attributes.state) {
						state[i] = model.attributes.state[i];
						count++;

						if ((count === 10) || (currentRound === rounds && count === (total % 10))) {
							gapi.hangout.data.submitDelta(state);
							currentRound++;
							state = {};
							count = 0;
						}
					}

					_this.close();
				}
			});
		},


		addCampaign: function (ev, model) {
			var campaignFormModalView = new CampaignFormModalView({campaignModel: model, campaignCollection: this.campaignCollection});
			campaignFormModalView.show();

			/*
			var _this = this;
			campaignFormModalView.onHidden = function () {
				_this.open();
			};

			this.close();
			*/
		}

	});

});