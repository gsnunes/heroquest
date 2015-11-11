define([

	'text!template/SettingsTabView.html',
	'view/CampaingListModalView',
	'view/CharListModalView',
	'view/component/ConfirmModalView'

], function (html, CampaingListModalView, CharListModalView, ConfirmModalView) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		events: {
			'click .manage-heroes': 'showCharListModal',
			'click .manage-campaings': 'showCampaingListModal',
			'click .remove-all-pieces': function () {
				if (util.isMaster()) {
					var newModal = new ConfirmModalView({type: 'danger', body: 'Do you really want to remove all pieces from the board but heroes ?', callback: _.bind(function () {
						util.removeAllMasterPiecesFromBoard('piece');
						newModal.close();
					}, this)});
					newModal.open();
				}
			},
			'click .clear-history': function () {
				if (util.isMaster()) {
					var newModal = new ConfirmModalView({type: 'danger', body: 'Do you really want to clear history ?', callback: _.bind(function () {
						util.removeAllMasterPiecesFromBoard('history');
						newModal.close();
					}, this)});
					newModal.open();
				}
			},
			'click .reset-treasures': function () {
				if (util.isMaster()) {
					var newModal = new ConfirmModalView({type: 'danger', body: 'Do you really want to reset treasures deck ?', callback: _.bind(function () {
						util.removeAllMasterPiecesFromBoard('treasure');
						newModal.close();
					}, this)});
					newModal.open();
				}
			}
		},


		afterRender: function () {
			if (util.isMaster()) {
				this.$('.reset-settings').removeClass('hide');
			}
			else {
				this.$('.reset-settings').remove();
			}
		},


		showCampaingListModal: function () {
			var campaingListModalView = new CampaingListModalView();
			campaingListModalView.open();
		},
		

		showCharListModal: function () {
			var charListModalView = new CharListModalView();
			charListModalView.open();
		}

	});

});