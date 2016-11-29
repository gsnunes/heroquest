define([

	'text!template/WelcomeModalView.html',
	'view/component/ModalView',
	'view/CampaignListModalView',
	'view/CharListModalView'

], function (Template, ModalView, CampaignListModalView, CharListModalView) {

	'use strict';

	return ModalView.extend({

		template: _.template(Template),


		events: {
			'click .btn-default': function () {
				i18n.changeLanguage('pt', (err, t) => {
					console.log(i18n.t('Welcome'));
				});
			},
			'click .btn-danger': function () {
				console.log(i18n.t('Welcome'));
			}
		},


		initialization: function () {
			$('.i18n').i18n();
		},


		showCampaignListModal: function () {
			var campaignListModalView = new CampaignListModalView();
			campaignListModalView.open();
		},
		

		showCharListModal: function () {
			var charListModalView = new CharListModalView();
			charListModalView.open();
		},


		onHidden: function () {
			if (util.isMaster()) {
				this.showCampaignListModal();
			}
			else {
				this.showCharListModal();
			}
		}

	});

});