define([

	'text!template/CampaingListModalView.html',
	'view/component/ModalView',
	'view/CampaingFormModalView',
	'collection/CampaingCollection',
	'view/component/ListGroupView',
	'view/component/ButtonView',
	'view/component/ButtonToolbarView'

], function (Template, ModalView, CampaingFormModalView, CampaingCollection, ListGroupView, ButtonView, ButtonToolbarView) {

	'use strict';

	return ModalView.extend({

		template: _.template(Template),


		events: {
			'click .add-campaing': 'addCampaing'
		},


		campaingCollection: new CampaingCollection(),


		initialize: function () {
			ModalView.prototype.initialize.apply(this, arguments);

			this.token = gapi.auth.getToken('token', true);

			this.createListGroup();
			this.getData();
		},


		createListGroup: function () {
			this.listGroupView = new ListGroupView({el: this.$el.find('.campaing-list-group')});
			this.listGroupView.render();
		},


		getData: function () {
			var self = this;

			this.campaingCollection.fetch({ 
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
					btnStart = new ButtonView({style: 'btn-success', size: 'btn-xs', caption: 'Start', icon: 'glyphicon glyphicon-ok'}),
					btnEdit = new ButtonView({style: 'btn-warning', size: 'btn-xs', caption: 'Edit', icon: 'glyphicon glyphicon-edit'}),
					btnRemove = new ButtonView({style: 'btn-danger', size: 'btn-xs', caption: 'Remove', icon: 'glyphicon glyphicon-remove'}),
					buttonToolbarView = new ButtonToolbarView();

				buttonToolbarView.addButtons([btnStart, btnEdit, btnRemove]);
				buttonToolbarView.addClass('pull-right');

				listGroupItem.append(buttonToolbarView.template());
				listGroupItem.append('<div class="clearfix"></div>');

				$(listGroupItem).find('.btn-success').on('click', function () {
					self.start(model);
				});

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
			HEROQUEST.campaingModel = model;

			Backbone.EventBus.trigger('PiecesPanel.SettingsTab.setCampaing');
			Backbone.EventBus.trigger('HistoryPanel.setTitle', model.attributes.name);
			
			this.hide();
		},


		addCampaing: function (ev, model) {
			var campaingFormModalView = new CampaingFormModalView({campaingModel: model, campaingCollection: this.campaingCollection});
			campaingFormModalView.show();
		}

	});

});