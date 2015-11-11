define([

	'text!template/CampaingFormModalView.html',
	'view/component/ModalView',
	'model/CampaingModel',
	'collection/HistoryCollection'

], function (Template, ModalView, CampaingModel, HistoryCollection) {

	'use strict';

	return ModalView.extend({

		template: _.template(Template),


		events: {
			'click .save-changes': 'submit'
		},


		initialize: function () {
			ModalView.prototype.initialize.apply(this, arguments);

			this.token = gapi.auth.getToken('token', true);

			this.campaingModel = this.options.campaingModel;
			this.campaingCollection = this.options.campaingCollection;

			this.populate();
		},


		populate: function () {
			if (this.campaingModel) {
				this.$el.find('input#name').val(this.campaingModel.attributes.name);
				this.$el.find('textarea#description').val(this.campaingModel.attributes.description);
			}
		},


		getDataFromForm: function () {
			var data = {
				name: this.$el.find('input#name').val(),
				description: this.$el.find('textarea#description').val()
			};

			return data;
		},


		submit: function () {
			if (this.campaingModel) {
				this.campaingModel.save(this.getDataFromForm());
			}
			else {
				var campaingModel = new CampaingModel(this.getDataFromForm());
				this.campaingCollection.create(campaingModel);
			}

			this.hide();
		}

	});

});