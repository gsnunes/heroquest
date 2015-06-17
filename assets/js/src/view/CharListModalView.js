define([

	'text!template/CharListModalView.html',
	'view/component/ModalView',
	'view/CharFormModalView',
	'collection/CharCollection',
	'collection/CampaingCollection',
	'view/component/ListGroupView',
	'view/component/ButtonView',
	'view/component/ButtonToolbarView'

], function (Template, ModalView, CharFormModalView, CharCollection, CampaingCollection, ListGroupView, ButtonView, ButtonToolbarView) {

	'use strict';

	return ModalView.extend({

		template: _.template(Template),


		events: {
			'click .add-char': 'addChar'
		},


		charCollection: new CharCollection(),
		campaingCollection: new CampaingCollection(),


		initialize: function () {
			ModalView.prototype.initialize.apply(this, arguments);

			gapi.hangout.data.setValue('campaingId', '1');

			this.createListGroup();
			this.getData();
		},


		createListGroup: function () {
			this.listGroupView = new ListGroupView({el: this.$el.find('.char-list-group')});
			this.listGroupView.render();
		},


		getData: function () {
			var self = this;

			this.charCollection.fetch({
				data: {personId: gapi.hangout.getLocalParticipant().person.id},
				success: function () {
					self.populateListGroup();
					self.charCollection.on('add', self.populateListGroup, self);
					self.charCollection.on("change", self.populateListGroup, self);
					self.charCollection.on("remove", self.populateListGroup, self);
				}
			});
		},


		populateListGroup: function () {
			var self = this;

			this.listGroupView.reset();

			this.charCollection.forEach(function (model) {
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
					self.addChar(ev, model);
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
			var campaingId = gapi.hangout.data.getValue('campaingId'),
				campaingModel,
				self = this;

			if (campaingId) {
				this.campaingCollection.fetch({
					success: function () {
						campaingModel = self.campaingCollection.get(campaingId);
						GLOBAL.campaingModel = campaingModel;

						Backbone.EventBus.trigger('PiecesPanel.SettingsTab.setName', model.attributes.name);
						Backbone.EventBus.trigger('HistoryPanel.setTitle', campaingModel.attributes.name);

						GLOBAL.charModel = model;
						Backbone.EventBus.trigger('BoardView.AddCharPiece', model);
						self.hide();
					}
				});
			}
			else {
				alert('O mestre ainda nao escolheu a campanha');
			}
		},


		addChar: function (ev, model) {
			var charFormModalView = new CharFormModalView({charModel: model, charCollection: this.charCollection});
			charFormModalView.show();
		}

	});

});