define([

	'text!template/CampaingListModalView.html',
	'view/component/ModalView',
	'view/CampaingFormModalView',
	'collection/CampaingCollection',
	'view/component/ListGroupView',
	'view/component/ButtonView',
	'view/component/ButtonToolbarView',
	'view/ChangeMasterModalView'

], function (Template, ModalView, CampaingFormModalView, CampaingCollection, ListGroupView, ButtonView, ButtonToolbarView, ChangeMasterModalView) {

	'use strict';

	return ModalView.extend({

		template: _.template(Template),


		events: {
			'click .add-campaing': 'addCampaing',
			'click .btn-change-master': 'changeMaster'
		},


		campaingCollection: new CampaingCollection(),


		initialize: function () {
			ModalView.prototype.initialize.apply(this, arguments);

			this.token = gapi.auth.getToken('token', true);

			this.showChangeMasterButton();
			this.createListGroup();
			this.getData();
		},


		bindEvents: function () {
			ModalView.prototype.bindEvents.apply(this, arguments);

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
			this.listGroupView = new ListGroupView({el: this.$el.find('.campaing-list-group')});
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
					buttons = util.isMaster() ? [btnStart, btnEdit, btnRemove] : [btnEdit, btnRemove];

				buttonToolbarView.addButtons(buttons);
				buttonToolbarView.addClass('pull-right');

				listGroupItem.append(buttonToolbarView.template());
				listGroupItem.append('<div class="clearfix"></div>');

				if (util.isMaster()) {
					$(listGroupItem).find('.btn-success').on('click', function () {
						self.start(model);
					});
				}

				$(listGroupItem).find('.btn-warning').on('click', function (ev) {
					self.addCampaing(ev, model);
				});

				$(listGroupItem).find('.btn-danger').on('click', function () {
					model.destroy();
				});
			});
		},


		/**
		 * start
		 */
		start: function (model) {
			gapi.hangout.data.setValue('campaing', model.attributes.id.toString());

			if (model.attributes.state) {
				gapi.hangout.data.submitDelta(model.attributes.state);
			}
			
			this.hide();
		},


		addCampaing: function (ev, model) {
			var campaingFormModalView = new CampaingFormModalView({campaingModel: model, campaingCollection: this.campaingCollection});
			campaingFormModalView.show();
		},


		changeMaster: function () {
			if (util.isMaster()) {
				var changeMasterModalView = new ChangeMasterModalView();
				changeMasterModalView.show();
			}
		}

	});

});