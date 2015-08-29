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
			'click .add-campaing': 'addCampaing',
			'click .btn-change-master': 'changeMaster'
		},


		campaingCollection: new CampaingCollection(),


		initialize: function () {
			NewModalView.prototype.initialize.apply(this, arguments);
			this.token = gapi.auth.getToken('token', true);
		},


		afterRender: function () {
			this.showChangeMasterButton();
			this.createListGroup();
			this.getData();
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
		},


		getData: function () {
			var self = this;

			this.campaingCollection.fetch({
				data: {personId: gapi.hangout.getLocalParticipant().person.id},
				success: function () {
					self.populateListGroup();
					self.campaingCollection.on('add', self.populateListGroup, self);
					self.campaingCollection.on("change", self.populateListGroup, self);
					self.campaingCollection.on("remove", self.populateListGroup, self);
				}
			});
		},


		populateListGroup: function () {
			var self = this;

			this.listGroupView.reset();

			this.campaingCollection.forEach(function (model) {
				var listGroupItem = self.listGroupView.addItem(model.attributes.name, model.attributes.description),
					btnStart = new ButtonView({style: 'btn-success', size: 'btn-xs', caption: 'Load', icon: 'glyphicon glyphicon-ok'}),
					btnEdit = new ButtonView({style: 'btn-warning', size: 'btn-xs', caption: 'Edit', icon: 'glyphicon glyphicon-edit'}),
					btnRemove = new ButtonView({style: 'btn-danger', size: 'btn-xs', caption: 'Remove', icon: 'glyphicon glyphicon-remove'}),
					buttonToolbarView = new ButtonToolbarView(),
					buttons = util.isMaster() ? [btnRemove, btnEdit, btnStart] : [btnEdit, btnRemove];

				buttonToolbarView.addButtons(buttons);
				buttonToolbarView.addClass('pull-right');

				listGroupItem.append(buttonToolbarView.template());
				listGroupItem.append('<div class="clearfix"></div>');

				if (util.isMaster()) {
					$(listGroupItem).find('.btn-success').on('click', function () {
						var newModal = new ConfirmModalView({type: 'warning', body: 'Do you really want to load <b>' + model.attributes.name + '</b> ? You will overwrite the current state.', callback: function () {
							self.start(model);
							newModal.close();
						}});
						newModal.open();
					});
				}

				$(listGroupItem).find('.btn-warning').on('click', function (ev) {
					self.addCampaing(ev, model);
				});

				$(listGroupItem).find('.btn-danger').on('click', function () {
					var newModal = new ConfirmModalView({type: 'danger', body: 'Do you really want to remove <b>' + model.attributes.name + '</b> ?', callback: function () {
						model.destroy();
						newModal.close();
					}});
					newModal.open();
				});
			});
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
			var _this = this;
			
			util.setValue('campaing', model.attributes.id.toString(), 300, function () {
				if (_.keys(model.attributes.state).length) {
					console.log(model.attributes.state);
					util.submitDelta(model.attributes.state, 300, function () {
						_this.close();
					});
				}
			});
		},


		addCampaing: function (ev, model) {
			var campaingFormModalView = new CampaingFormModalView({campaingModel: model, campaingCollection: this.campaingCollection});
			campaingFormModalView.show();
		},


		changeMaster: function () {
			if (util.isMaster()) {
				var changeMasterModalView = new ChangeMasterModalView();
				changeMasterModalView.open();
			}
		}

	});

});