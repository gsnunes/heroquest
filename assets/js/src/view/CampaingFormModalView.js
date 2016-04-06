define([

	'text!template/CampaingFormModalView.html',
	'view/component/ModalView',
	'model/CampaingModel'

], function (Template, ModalView, CampaingModel) {

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
				this.$el.find('input#url').val(this.campaingModel.attributes.url);
				this.$el.find('input#name').val(this.campaingModel.attributes.name);
				this.$el.find('textarea#description').val(this.campaingModel.attributes.description);
			}
			else {
				this.$el.find('input#url').val(gapi.hangout.getHangoutUrl());
			}
		},


		getDataFromForm: function () {
			var data = {
				name: this.$el.find('input#name').val(),
				description: this.$el.find('textarea#description').val(),
				url: this.campaingModel && typeof this.campaingModel.attributes.url === 'string' ? this.campaingModel.attributes.url : gapi.hangout.getHangoutUrl()
			};

			return data;
		},


		submit: function () {
			if (this.campaingModel) {
				this.campaingModel.save(this.getDataFromForm());
			}
			else {
				var campaingModel = new CampaingModel(this.getDataFromForm());
				this.campaingCollection.create(campaingModel, {
					success: function () {
						//if (!gapi.hangout.data.getValue('campaing')) {
						gapi.hangout.data.setValue('campaing', campaingModel.id.toString());
						//}
					}
				});
			}

			this.hide();
		}

	});

});