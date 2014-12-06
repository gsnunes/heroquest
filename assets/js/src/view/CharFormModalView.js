define([

	'text!template/CharFormModalView.html',
	'view/component/ModalView',
	'model/CharModel'

], function (Template, ModalView, CharModel) {

	'use strict';

	return ModalView.extend({

		template: _.template(Template),


		events: {
			'click .save-changes': 'submit'
		},


		initialize: function () {
			ModalView.prototype.initialize.apply(this, arguments);

			this.token = gapi.auth.getToken('token', true);

			this.charModel = this.options.charModel;
			this.charCollection = this.options.charCollection;

			this.populate();
		},


		populate: function () {
			if (this.charModel) {
				this.$el.find('input#name').val(this.charModel.attributes.name);
				this.$el.find('textarea#description').val(this.charModel.attributes.description);
				this.$el.find('select#character').val(this.charModel.attributes.character);
				this.$el.find('input#quests').val(this.charModel.attributes.quests);
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
			if (this.charModel) {
				this.charModel.save(this.getDataFromForm());
			}
			else {
				var charModel = new CharModel(this.getDataFromForm());
				this.charCollection.create(charModel);
			}

			this.hide();
		}

	});

});