define([

	'text!template/CampaignFormModalView.html',
	'view/component/ModalView',
	'model/CampaignModel'

], function (Template, ModalView, CampaignModel) {

	'use strict';

	return ModalView.extend({

		template: _.template(Template),


		events: {
			'click .save-changes': 'submit'
		},


		initialize: function () {
			ModalView.prototype.initialize.apply(this, arguments);

			this.token = gapi.auth.getToken('token', true);

			this.campaignModel = this.options.campaignModel;
			this.campaignCollection = this.options.campaignCollection;

			this.populate();
		},


		populate: function () {
			if (this.campaignModel) {
				this.$el.find('input#url').val(this.campaignModel.attributes.url);
				this.$el.find('input#name').val(this.campaignModel.attributes.name);
				this.$el.find('textarea#description').val(this.campaignModel.attributes.description);
			}
			else {
				this.$el.find('input#url').val(gapi.hangout.getHangoutUrl());
			}
		},


		getDataFromForm: function () {
			var data = {
				name: this.$el.find('input#name').val(),
				description: this.$el.find('textarea#description').val(),
				url: this.campaignModel && typeof this.campaignModel.attributes.url === 'string' ? this.campaignModel.attributes.url : gapi.hangout.getHangoutUrl()
			};

			return data;
		},


		submit: function () {
			if (this.campaignModel) {
				this.campaignModel.save(this.getDataFromForm());
			}
			else {
				var campaignModel = new CampaignModel(this.getDataFromForm());
				this.campaignCollection.create(campaignModel, {
					success: function () {
						//if (!gapi.hangout.data.getValue('campaign')) {
						gapi.hangout.data.setValue('campaign', campaignModel.id.toString());
						//}
					}
				});
			}

			this.hide();
		}

	});

});