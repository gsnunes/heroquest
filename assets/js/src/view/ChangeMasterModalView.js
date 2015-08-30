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


		afterRender: function () {
			this.populateParticipants();
		},


		populateParticipants: function () {
			var participants = gapi.hangout.getParticipants(),
				i, len = participants.length,
				options = [];

			for (i = 0; i < len; i++) {
				options.push('<option value="' + participants[i].id + '">' + participants[i].person.displayName + '</option>');
			}

			this.$('#change-master-participants').html(options.join());
		},


		changeMaster: function (ev) {
			ev.preventDefault();

			var newModal = new ConfirmModalView({type: 'warning', body: 'Do you really want to change the master to <b>' + this.$('#change-master-participants').text() + '</b> ?', callback: _.bind(function () {
				var participant = gapi.hangout.getParticipantById(this.$('#change-master-participants').val());

				util.clearValue('campaing', 300, _.bind(function () {
					util.removeAllMasterPiecesFromBoard('treasure');
					gapi.hangout.data.setValue('master', JSON.stringify(participant));

					this.close();
					newModal.close();
				}, this));
			}, this)});
			newModal.open();
		}

	});

});