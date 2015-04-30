define([

	'text!template/CharFormModalView.html',
	'view/component/ModalView',
	'model/CharModel',
	'collection/CharacterCollection'

], function (Template, ModalView, CharModel, CharacterCollection) {

	'use strict';

	return ModalView.extend({

		template: _.template(Template),


		events: {
			'click .save-changes': 'submit',
			'change select#character': 'characterChange'
		},


		characterCollection: new CharacterCollection(),


		initialize: function () {
			ModalView.prototype.initialize.apply(this, arguments);

			this.token = gapi.auth.getToken('token', true);

			this.charModel = this.options.charModel;
			this.charCollection = this.options.charCollection;

			this.getData();
		},


		/**
		 * getData
		 */
		getData: function () {
			var self = this;

			this.characterCollection.fetch({
				success: function () {
					self.populate();
				}
			});
		},


		populate: function () {
			this.populateCharacterSelect();

			if (this.charModel) {
				this.$el.find('input#name').val(this.charModel.attributes.name);
				this.$el.find('textarea#description').val(this.charModel.attributes.description);
				
				this.$el.find('select#character').val(this.charModel.attributes.character);
				this.$el.find('select#character').prop('disabled', true);

				this.$el.find('input#quests').val(this.charModel.attributes.quests);

				this.populateAttr(this.charModel.attributes.attr);
			}
		},


		/**
		 * populateAttr
		 */
		populateAttr: function (attr) {
			this.$el.find('input#mo').val(attr.mo);
			this.$el.find('input#a').val(attr.a);
			this.$el.find('input#d').val(attr.d);
			this.$el.find('input#b').val(attr.b);
			this.$el.find('input#m').val(attr.m);
		},


		/**
		 * getAttr
		 */
		getAttr: function () {
			return {
				mo: this.$el.find('input#mo').val(),
				a: this.$el.find('input#a').val(),
				d: this.$el.find('input#d').val(),
				b: this.$el.find('input#b').val(),
				m: this.$el.find('input#m').val()
			};
		},


		/**
		 * populateCharacterSelect
		 */
		populateCharacterSelect: function () {
			var characters = [];

			this.$el.find('select#character').html();

			this.characterCollection.forEach(function (model) {
				characters.push('<option value="' + model.attributes.name + '">' + model.attributes.name + '</option>');
			});

			this.$el.find('select#character').html(characters.join());
			this.populateAttr(this.characterCollection.at(0).attributes.attr);
		},


		/**
		 * characterChange
		 */
		characterChange: function () {
			var charCollection = this.characterCollection.findWhere({name: $('select#character').val()});
			this.populateAttr(charCollection.attributes.attr);

			if (charCollection.attributes.hasSpell) {
				this.createSpellDropdown();
			}
		},


		/**
		 * createSpellDropdown
		 */
		createSpellDropdown: function () {
			//this.$el.find('.modal-body').append('<select class="form-control" id="spellTypes"><option></option><option>test</option></select>');
		},


		getDataFromForm: function () {
			var data = {
				name: this.$el.find('input#name').val(),
				description: this.$el.find('textarea#description').val(),
				character: this.$el.find('select#character').val(),
				quests: this.$el.find('input#quests').val(),
				access_token: this.token.access_token,
				attr: this.getAttr()
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