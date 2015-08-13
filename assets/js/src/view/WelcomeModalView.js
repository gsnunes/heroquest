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
			campaingListModalView.show();
		},
		

		showCharListModal: function () {
			var charListModalView = new CharListModalView();
			charListModalView.show();
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