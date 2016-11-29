define([

	'text!template/SettingsTabView.html',
	'view/CampaignListModalView',
	'view/CharListModalView',
	'view/component/ConfirmModalView',
	'view/ChangeMasterModalView'

], function (html, CampaignListModalView, CharListModalView, ConfirmModalView, ChangeMasterModalView) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		events: {
			'click .btn-change-master': 'changeMaster',
			'click .manage-heroes': 'showCharListModal',
			'click .manage-campaigns': 'showCampaignListModal',
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


		changeMaster: function () {
			if (util.isMaster()) {
				var changeMasterModalView = new ChangeMasterModalView();
				changeMasterModalView.open();
			}
		},


		initialize: function () {
			this.totalTreasures = GLOBAL.data.treasure.length;
			this.countTreasures = GLOBAL.data.treasure.length;

			this.bindEvents();
		},


		afterRender: function () {
			if (util.isMaster()) {
				this.$('.reset-settings').removeClass('hide');
			}
			else {
				this.$('.reset-settings').remove();
			}

			this.populate();
		},


		bindEvents: function () {
			gapi.hangout.data.onStateChanged.add(_.bind(function (ev) {
				if (ev.addedKeys.length) {
					for (var i = 0, len = ev.addedKeys.length; i < len; i++) {
						if (ev.addedKeys[i].key.match(/boughtTreasures/gi)) {
							this.countTreasures = this.totalTreasures - (JSON.parse(ev.state[ev.addedKeys[i].key])).length;
							this.populateResetButton();
						}
					}
				}
			}, this));
		},


		populate: function () {
			var state = gapi.hangout.data.getState();

			_.each(state, _.bind(function (value, key) {
				if (key.match(/boughtTreasures/gi)) {
					this.countTreasures = this.totalTreasures - (JSON.parse(value)).length;
				}
			}, this));

			this.populateResetButton();
		},


		populateResetButton: function () {
			this.$('.reset-treasures').html('<span class="glyphicon glyphicon-remove"></span> Reset treasures (' + this.countTreasures + '/' + this.totalTreasures + ')');
		},


		showCampaignListModal: function () {
			var campaignListModalView = new CampaignListModalView();
			campaignListModalView.open();
		},


		showCharListModal: function () {
			var charListModalView = new CharListModalView();
			charListModalView.open();
		}

	});

});
