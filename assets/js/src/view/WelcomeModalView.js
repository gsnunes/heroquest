define([

	'text!template/WelcomeModalView.html',
	'view/component/ModalView',
	'view/CampaingListModalView',
	'view/CharListModalView'

], function (Template, ModalView, CampaingListModalView, CharListModalView) {

	'use strict';

	return ModalView.extend({

		template: _.template(Template),


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