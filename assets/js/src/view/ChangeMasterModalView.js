define([

	'text!template/ChangeMasterModalView.html',
	'view/component/NewModalView',
	'view/component/ConfirmModalView'

], function (html, NewModalView, ConfirmModalView) {

	'use strict';

	return NewModalView.extend({

		template: html,


		events: {
			'click #change-master-button': 'changeMaster'
		},


		initialize: function () {
			this.bindEvents();
		},


		afterRender: function () {
			this.populateParticipants();
		},


		bindEvents: function () {
			gapi.hangout.onParticipantsChanged.add(_.bind(function () {
				this.populateParticipants();
			}, this));
		},


		populateParticipants: function () {
			var localParticipant = gapi.hangout.getLocalParticipant(),
				participants = gapi.hangout.getParticipants(),
				i, len = participants.length,
				options = [];

			for (i = 0; i < len; i++) {
				if (participants[i].id !== localParticipant.id) {
					options.push('<option value="' + participants[i].id + '">' + participants[i].person.displayName + '</option>');
				}
			}

			this.$('#change-master-participants').html(options.join());

			if (!options.length) {
				this.$('#change-master-button').prop('disabled', true);
			}
		},


		changeMaster: function (ev) {
			ev.preventDefault();

			var newModal = new ConfirmModalView({type: 'warning', body: 'Do you really want to change the master to <b>' + this.$('#change-master-participants').text() + '</b> ?', callback: _.bind(function () {
				var participant = gapi.hangout.getParticipantById(this.$('#change-master-participants').val());
				gapi.hangout.data.setValue('master', JSON.stringify(participant));
				newModal.close();
				this.close();
				/*
				util.clearValue('campaing', 300, _.bind(function () {
					util.clearState();
					util.removeAllMasterPiecesFromBoard('treasure');
					gapi.hangout.data.setValue('master', JSON.stringify(participant));

					this.close();
					newModal.close();
				}, this));
				*/
			}, this)});

			if (this.$('#change-master-participants').val()) {
				newModal.open();
			}
		},


		clearOldCampaing: function (model) {
			util.clearState();

			var interval = setInterval(_.bind(function () {
				var keys = gapi.hangout.data.getKeys();
				
				if (keys.length === 1) {
					clearInterval(interval);
					this.loadNewCampaing(model);
				}
			}, this), 300);
		}

	});

});