define([

	'text!template/SettingsTabView.html',
	'view/CampaingListModalView',
	'view/CharListModalView'

], function (html, CampaingListModalView, CharListModalView) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		events: {
			'click .manage-heroes': 'showCharListModal',
			'click .manage-campaings': 'showCampaingListModal'
		},


		showCampaingListModal: function () {
			var campaingListModalView = new CampaingListModalView();
			campaingListModalView.show();
		},
		

		showCharListModal: function () {
			var charListModalView = new CharListModalView();
			charListModalView.show();
		}

	});

});