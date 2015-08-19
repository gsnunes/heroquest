define([

	'text!template/CharListModalView.html',
	'view/component/NewModalView',
	'view/CharFormModalView',
	'collection/CharCollection',
	'collection/CampaingCollection',
	'view/component/ListGroupView',
	'view/component/ButtonView',
	'view/component/ButtonToolbarView',
	'view/component/ConfirmModalView'

], function (html, NewModalView, CharFormModalView, CharCollection, CampaingCollection, ListGroupView, ButtonView, ButtonToolbarView, ConfirmModalView) {

	'use strict';

	return NewModalView.extend({

		template: html,


		events: {
			'click .add-char': 'addChar'
		},


		charCollection: new CharCollection(),
		campaingCollection: new CampaingCollection(),


		initialize: function () {
			NewModalView.prototype.initialize.apply(this, arguments);
		},


		afterRender: function () {
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
				var listGroupItem = self.listGroupView.addItem(model.attributes.name + ' (' + model.attributes.character + ')', model.attributes.inventory),
					btnStart = new ButtonView({style: 'btn-success', size: 'btn-xs', caption: 'Add to board', icon: 'glyphicon glyphicon-ok'}),
					btnEdit = new ButtonView({style: 'btn-warning', size: 'btn-xs', caption: 'Edit', icon: 'glyphicon glyphicon-edit'}),
					btnRemove = new ButtonView({style: 'btn-danger', size: 'btn-xs', caption: 'Remove', icon: 'glyphicon glyphicon-remove'}),
					buttonToolbarView = new ButtonToolbarView();

				buttonToolbarView.addButtons([btnRemove, btnEdit, btnStart]);
				buttonToolbarView.addClass('pull-right');

				listGroupItem.append(buttonToolbarView.template());
				listGroupItem.append('<div class="clearfix"></div>');

				$(listGroupItem).find('.btn-success').on('click', function () {
					self.start(self.charCollection.get(model.id));
				});

				$(listGroupItem).find('.btn-warning').on('click', function (ev) {
					self.addChar(ev, model);
				});

				$(listGroupItem).find('.btn-danger').on('click', function () {
					var newModal = new ConfirmModalView({type: 'danger', body: 'Do you really want to remove <b>' + model.attributes.name + ' (' + model.attributes.character + ')' + '</b> ?', callback: function () {
						model.destroy();
						newModal.close();
					}});
					newModal.open();
				});
			});
		},


		start: function (model) {
			var charLen = $('.board').find('.piece .sprite-characters').length,
				state = gapi.hangout.data.getState(),
				key = 'piece-' + model.id,
				hasPiece = false;

			_.each(state, function (value, key) {
				if (key.match(/piece/gi)) {
					if (key.substr(6) === model.id.toString()) {
						hasPiece = true;
					}
				}
			});

			if (hasPiece) {
				alert('This hero is already on the board!');
			}
			else {
				gapi.hangout.data.setValue(key, JSON.stringify({id: key, position: {offsetX: (552 + (charLen * 62)), offsetY: 52}, model: model}));
			}
		},


		addChar: function (ev, model) {
			var charFormModalView = new CharFormModalView({charModel: model, charCollection: this.charCollection});
			charFormModalView.show();
		}

	});

});