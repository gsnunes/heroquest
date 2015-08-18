define([

	'text!template/ChangeMasterModalView.html',
	'view/component/ModalView'

], function (html, ModalView) {

	'use strict';

	return ModalView.extend({

		template: _.template(html),


		events: {
			'click #change-master-button': 'changeMaster'
		},


		initialize: function () {
			ModalView.prototype.initialize.apply(this, arguments);
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

			var participant = gapi.hangout.getParticipantById(this.$('#change-master-participants').val());
			gapi.hangout.data.submitDelta(null, 'campaing');
			gapi.hangout.data.setValue('master', JSON.stringify(participant));
			this.$('#' + this.id).modal('hide');
		}

	});

});