define([

	'text!template/CharFormModalView.html',
	'view/component/ModalView',
	'model/CharModel'

], function (Template, ModalView, CharModel) {

	'use strict';

	return ModalView.extend({

		template: _.template(Template),


		events: {
			'click .save-changes': 'submit',
			'change select#character': 'characterChange'
		},


		initialize: function () {
			ModalView.prototype.initialize.apply(this, arguments);

			this.token = gapi.auth.getToken('token', true);

			this.charModel = this.options.charModel;
			this.charCollection = this.options.charCollection;

			this.populate();
		},


		populate: function () {
			this.populateCharacterSelect();

			if (this.charModel) {
				this.$el.find('input#name').val(this.charModel.attributes.name);
				this.$el.find('textarea#inventory').val(this.charModel.attributes.inventory);
				
				this.$el.find('select#character').val(this.charModel.attributes.character);
				this.$el.find('select#character').prop('disabled', true);

				this.$el.find('input#quests').val(this.charModel.attributes.quests);

				this.populateAttr(this.charModel.attributes);
			}
		},


		/**
		 * populateAttr
		 */
		populateAttr: function (attr) {
			this.$el.find('input#mo').val(attr.movement);
			this.$el.find('input#a').val(attr.attack);
			this.$el.find('input#d').val(attr.defense);
			this.$el.find('input#b').val(attr.body);
			this.$el.find('input#m').val(attr.mind);
		},


		/**
		 * populateCharacterSelect
		 */
		populateCharacterSelect: function () {
			var characters = [];

			this.$el.find('select#character').html();

			GLOBAL.data.character.forEach(function (data) {
				characters.push('<option value="' + data.name + '">' + data.name + '</option>');
			});

			this.$el.find('select#character').html(characters.join());
			this.populateAttr(GLOBAL.data.character[0]);
			this.$el.find('textarea#inventory').val(GLOBAL.data.character[0].inventory);
		},


		/**
		 * characterChange
		 */
		characterChange: function () {
			var charCollection = _.where(GLOBAL.data.character, {name: $('select#character').val()})[0];
			this.$el.find('textarea#inventory').val(charCollection.inventory);
			this.populateAttr(charCollection);
		},


		getDataFromForm: function () {
			var data = {
				name: this.$el.find('input#name').val(),
				inventory: this.$el.find('textarea#inventory').val(),
				character: this.$el.find('select#character').val(),
				quests: this.$el.find('input#quests').val(),
				access_token: this.token.access_token,
				movement: this.$el.find('input#mo').val(),
				attack: this.$el.find('input#a').val(),
				defense: this.$el.find('input#d').val(),
				body: this.$el.find('input#b').val(),
				mind: this.$el.find('input#m').val()
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