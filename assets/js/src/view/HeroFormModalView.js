define([

	'text!template/HeroFormModalView.html',
	'view/component/ModalView',
	'model/HeroModel'

], function (Template, ModalView, HeroModel) {

	'use strict';

	return ModalView.extend({

		template: _.template(Template),


		events: {
			'click .save-changes': 'submit'
		},


		initialize: function () {
			ModalView.prototype.initialize.apply(this, arguments);

			this.token = gapi.auth.getToken('token', true);

			this.heroModel = this.options.heroModel;
			this.heroCollection = this.options.heroCollection;

			this.populate();
		},


		populate: function () {
			if (this.heroModel) {
				this.$el.find('input#name').val(this.heroModel.attributes.name);
				this.$el.find('textarea#description').val(this.heroModel.attributes.description);
				this.$el.find('select#character').val(this.heroModel.attributes.character);
				this.$el.find('input#quests').val(this.heroModel.attributes.quests);
			}
		},


		getDataFromForm: function () {
			var data = {
				name: this.$el.find('input#name').val(),
				description: this.$el.find('textarea#description').val(),
				character: this.$el.find('select#character').val(),
				quests: this.$el.find('input#quests').val(),
				access_token: this.token.access_token
			};

			return data;
		},


		submit: function () {
			if (this.heroModel) {
				this.heroModel.save(this.getDataFromForm());
			}
			else {
				var heroModel = new HeroModel(this.getDataFromForm());
				this.heroCollection.create(heroModel);
			}

			this.hide();
		}

	});

});