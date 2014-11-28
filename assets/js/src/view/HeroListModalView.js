define([

	'text!template/HeroListModalView.html',
	'view/component/ModalView',
	'view/HeroFormModalView',
	'collection/HeroCollection',
	'view/component/ListGroupView',
	'view/component/ButtonView',
	'view/component/ButtonToolbarView'

], function (Template, ModalView, HeroFormModalView, HeroCollection, ListGroupView, ButtonView, ButtonToolbarView) {

	'use strict';

	return ModalView.extend({

		template: _.template(Template),


		events: {
			'click .add-hero': 'addHero'
		},


		heroCollection: new HeroCollection(),


		initialize: function () {
			ModalView.prototype.initialize.apply(this, arguments);

			this.createListGroup();
			this.getData();
		},


		createListGroup: function () {
			this.listGroupView = new ListGroupView({el: this.$el.find('.hero-list-group')});
			this.listGroupView.render();
		},


		getData: function () {
			var self = this;

			this.heroCollection.fetch({
				success: function () {
					self.populateListGroup();
					self.heroCollection.on('add', self.populateListGroup, self);
					self.heroCollection.on("change", self.populateListGroup, self);
					self.heroCollection.on("remove", self.populateListGroup, self);
				}
			});
		},


		populateListGroup: function () {
			var self = this;

			this.listGroupView.reset();

			this.heroCollection.forEach(function (model) {
				var listGroupItem = self.listGroupView.addItem(model.attributes.name, model.attributes.description),
					btnEdit = new ButtonView({style: 'btn-warning', size: 'btn-xs', caption: 'Edit', icon: 'glyphicon glyphicon-edit'}),
					btnRemove = new ButtonView({style: 'btn-danger', size: 'btn-xs', caption: 'Remove', icon: 'glyphicon glyphicon-remove'}),
					buttonToolbarView = new ButtonToolbarView();

				buttonToolbarView.addButtons([btnEdit, btnRemove]);
				buttonToolbarView.addClass('pull-right');

				listGroupItem.append(buttonToolbarView.template());
				listGroupItem.append('<div class="clearfix"></div>');

				$(listGroupItem).find('.btn-warning').on('click', function (ev) {
					self.addHero(ev, model);
				});

				$(listGroupItem).find('.btn-danger').on('click', function () {
					model.destroy();
				});

				$(listGroupItem).on('click', function (ev) {
					if (!$(ev.target).hasClass('btn-warning') && !$(ev.target).hasClass('btn-danger')) {
						Backbone.EventBus.trigger('BoardView.AddHeroPiece');
						self.hide();
					}
				});
			});
		},


		addHero: function (ev, model) {
			var heroFormModalView = new HeroFormModalView({heroModel: model, heroCollection: this.heroCollection});
			heroFormModalView.show();
		}

	});

});