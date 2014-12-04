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

			if (this.campaingModel) {
				this.historyCollection = new HistoryCollection([], {campaing_id: this.campaingModel.attributes._id});
				this.getHistoryData();
			}
		},


		populate: function () {
			if (this.campaingModel) {
				this.$el.find('input#name').val(this.campaingModel.attributes.name);
				this.$el.find('textarea#description').val(this.campaingModel.attributes.description);
			}
		},


		getHistoryData: function () {
			var self = this;

			this.historyCollection.fetch({
				success: function () {
					self.populateHistory();
				}
			});
		},


		populateHistory: function () {
			var self = this;

			this.$el.find('.campaing-history').html('');

			this.historyCollection.forEach(function (model) {
				var name = 'Zargon (' + model.attributes.person.name + ')',
					date = moment(model.attributes.date).format('MM-DD-YYYY, h:mm:ss a'),
					message = date + ' ' + name + ' - ' + model.attributes.message;

				/*
				if (model.attributes.displayIndex > 0) {

				}
				*/

				self.$el.find('.campaing-history').append('<li>' + message + '<li>');
			});
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