define([

	'text!template/WelcomeModalView.html',
	'view/component/ModalView',
	'view/CampaingListModalView',
	'view/HeroListModalView'

], function (Template, ModalView, CampaingListModalView, HeroListModalView) {

	'use strict';

	return ModalView.extend({

		template: _.template(Template),


		showCampaingListModal: function () {
			var campaingListModalView = new CampaingListModalView({backdrop: 'static'});
			campaingListModalView.show();
		},
		

		showHeroListModal: function () {
			var heroListModalView = new HeroListModalView({backdrop: 'static'});
			heroListModalView.show();
		},


		onHidden: function () {
			var participant = gapi.hangout.getLocalParticipant();

			if (participant.displayIndex === 1) {
				this.showCampaingListModal();
			}
			else {
				this.showHeroListModal();
			}
		}

	});

});