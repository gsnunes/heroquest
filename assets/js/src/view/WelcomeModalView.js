define([

	'text!template/WelcomeModalView.html',
	'view/component/ModalView',
	'view/CampaingListModalView',
	'view/CharListModalView'

], function (Template, ModalView, CampaingListModalView, CharListModalView) {

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


		showCampaingListModal: function () {
			var campaingListModalView = new CampaingListModalView();
			campaingListModalView.open();
		},
		

		showCharListModal: function () {
			var charListModalView = new CharListModalView();
			charListModalView.open();
		},


		onHidden: function () {
			if (util.isMaster()) {
				this.showCampaingListModal();
			}
			else {
				this.showCharListModal();
			}
		}

	});

});