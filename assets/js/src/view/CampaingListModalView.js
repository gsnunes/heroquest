define([

	'text!template/CampaingListModalView.html',
	'view/component/NewModalView',
	'view/CampaingFormModalView',
	'collection/CampaingCollection',
	'view/component/ListGroupView',
	'view/component/ButtonView',
	'view/component/ButtonToolbarView',
	'view/ChangeMasterModalView',
	'view/component/ConfirmModalView'

], function (html, NewModalView, CampaingFormModalView, CampaingCollection, ListGroupView, ButtonView, ButtonToolbarView, ChangeMasterModalView, ConfirmModalView) {

	'use strict';

	return NewModalView.extend({

		template: html,


		events: {
			'click .add-campaing': function () {
				this.checkUrlCampaing(_.bind(function (result) {
					if (!result.length && util.isMaster()) {
						this.addCampaing();
					}
				}, this));
			},
			'click .btn-change-master': 'changeMaster'
		},


		campaingCollection: new CampaingCollection(),


		initialize: function () {
			NewModalView.prototype.initialize.apply(this, arguments);
			this.token = gapi.auth.getToken('token', true);
		},


		afterRender: function () {
			this.$('.new-instance').attr('href', 'https://' + util.getHost());

			this.showChangeMasterButton();
			this.createListGroup();
			this.getData();
		},


		checkUrlCampaing: function (callback) {
			var campaingCollection = new CampaingCollection(),
				url = gapi.hangout.getHangoutUrl(),
				_this = this;

			campaingCollection.fetch({
				data: {url: url},
				success: function (result) {
					if (!result.length && util.isMaster()) {
						_this.$('.alert-info').addClass('hide');
						_this.$('.alert-success').removeClass('hide');
						_this.$('.btn-success').prop('disabled', false);
						_this.$('.current-campaing-list-group').addClass('hide');
					}
					else {
						if (util.isMaster()) {
							_this.$('.alert-info').removeClass('hide');
							_this.$('.alert-success').addClass('hide');
							_this.$('.current-campaing-list-group').removeClass('hide');
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
				}
			});
		},


		bindEvents: function () {
			NewModalView.prototype.bindEvents.apply(this, arguments);

			gapi.hangout.data.onStateChanged.add(_.bind(function (ev) {
				if (ev.addedKeys.length && ev.addedKeys[0].key.match(/master/gi)) {
					this.showChangeMasterButton();
					this.populateListGroup();
				}
			}, this));
		},


		showChangeMasterButton: function () {
			if (util.isMaster()) {
				this.$('.btn-change-master').show();
			}
			else {
				this.$('.btn-change-master').hide();
			}
		},


		createListGroup: function () {
			this.listGroupView = new ListGroupView({el: this.$('.campaing-list-group')});
			this.listGroupView.render();

			this.currentListGroupView = new ListGroupView({el: this.$('.current-campaing-list-group div')});
			this.currentListGroupView.render();
		},


		getData: function () {
			var self = this;

			this.campaingCollection.fetch({
				data: {personId: gapi.hangout.getLocalParticipant().person.id},
				success: function () {
					self.campaingCollection.on('sync', function () {
						self.checkUrlCampaing();
						self.populateListGroup();
					});

					self.campaingCollection.on('change', self.populateListGroup, self);
					self.campaingCollection.on('remove', self.populateListGroup, self);
				}
			});
		},


		populateListGroup: function () {
			var self = this,
				hasCurrentCampaing = false;

			this.listGroupView.reset();
			this.currentListGroupView.reset();

			if (this.campaingCollection.length) {
				this.campaingCollection.forEach(function (model) {
					var listGroupItem,
						btnStart = new ButtonView({style: 'btn-primary', size: 'btn-xs', caption: 'Go to', icon: 'glyphicon glyphicon-share-alt', disabled: (model.attributes.url === gapi.hangout.getHangoutUrl())}),
						btnEdit = new ButtonView({style: 'btn-warning', size: 'btn-xs', caption: 'Edit', icon: 'glyphicon glyphicon-edit'}),
						btnRemove = new ButtonView({style: 'btn-danger', size: 'btn-xs', caption: 'Remove', icon: 'glyphicon glyphicon-remove'}),
						buttonToolbarView = new ButtonToolbarView(),
						buttons = util.isMaster() ? [btnRemove, btnEdit, btnStart] : [btnEdit, btnRemove];

					if (model.attributes.url === gapi.hangout.getHangoutUrl()) {
						hasCurrentCampaing = true;
						listGroupItem = self.currentListGroupView.addItem(model.attributes.name, model.attributes.description);
					}
					else {
						listGroupItem = self.listGroupView.addItem(model.attributes.name, model.attributes.description);
					}

					buttonToolbarView.addButtons(buttons);
					buttonToolbarView.addClass('pull-right');

					listGroupItem.append(buttonToolbarView.template());
					listGroupItem.append('<div class="clearfix"></div>');

					if (util.isMaster() && (model.attributes.url !== gapi.hangout.getHangoutUrl())) {
						$(listGroupItem).find('.btn-primary').on('click', function () {
							var newModal = new ConfirmModalView({type: 'warning', body: 'Do you really want to load <b>' + model.attributes.name + '</b> ? You will be redirect to the campaing URL.', callback: function () {
								window.parent.location = model.attributes.url;
							}});
							newModal.open();
						});
					}

					$(listGroupItem).find('.btn-warning').on('click', function (ev) {
						self.addCampaing(ev, model);
					});

					$(listGroupItem).find('.btn-danger').on('click', function () {
						var newModal = new ConfirmModalView({type: 'danger', body: 'Do you really want to remove <b>' + model.attributes.name + '</b> ?', callback: function () {
							if (gapi.hangout.data.getValue('campaing') === model.attributes.id.toString()) {
								gapi.hangout.data.clearValue('campaing');
							}

							model.destroy({success: function () {
								self.checkUrlCampaing();
							}});
							newModal.close();
						}});
						newModal.open();
					});
				});

				if (hasCurrentCampaing) {
					self.$('.current-campaing-list-group').removeClass('hide');
				}
				else {
					self.$('.current-campaing-list-group').addClass('hide');
				}

				this.$('.no-data').addClass('hide');
			}
			else {
				this.$('.no-data').removeClass('hide');
			}
		},


		start: function (model) {
			util.clearValue('campaing', 300, _.bind(function () {
				this.clearOldCampaing(model);
			}, this));
		},


		clearOldCampaing: function (model) {
			util.clearState();

			var interval = setInterval(_.bind(function () {
				var keys = gapi.hangout.data.getKeys();
				
				if (keys.length === 1) {
					clearInterval(interval);
					this.loadNewCampaing(model);
				}
			}, this), 300);
		},


		loadNewCampaing: function (model) {
			var total = _.keys(model.attributes.state).length,
				rounds = Math.floor(total / 10),
				currentRound = 0,
				_this = this,
				state = {},
				count = 0,
				i;
			
			util.setValue('campaing', model.attributes.id.toString(), 300, function () {
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


		addCampaing: function (ev, model) {
			var campaingFormModalView = new CampaingFormModalView({campaingModel: model, campaingCollection: this.campaingCollection});
			campaingFormModalView.show();

			/*
			var _this = this;
			campaingFormModalView.onHidden = function () {
				_this.open();
			};

			this.close();
			*/
		},


		changeMaster: function () {
			if (util.isMaster()) {
				var changeMasterModalView = new ChangeMasterModalView();
				changeMasterModalView.open();

				this.close();
			}
		}

	});

});