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
			var campaingListModalView = new CampaingListModalView({backdrop: 'static'});
			campaingListModalView.show();
		},
		

		showCharListModal: function () {
			var charListModalView = new CharListModalView({backdrop: 'static'});
			charListModalView.show();
		},


		onHidden: function () {
			if (HEROQUEST.displayIndex === 0) {
				this.showCampaingListModal();
			}
			else {
				this.showCharListModal();
			}
		}

	});

});