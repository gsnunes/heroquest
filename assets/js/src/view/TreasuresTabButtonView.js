define([

	'text!template/TreasuresTabButtonView.html'

], function (html) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		events: {
			'submit form': 'send'
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

			this.$('#participants').html(options.join());

			if (!options.length) {
				this.$('.btn-default').prop('disabled', true);
			}
			else {
				this.$('.btn-default').prop('disabled', false);
			}
		},


		send: function (ev) {
			ev.preventDefault();

			var key = 'treasure-' + (new Date()).getTime(),
				person = gapi.hangout.getParticipantById(this.$('#participants').val()).person;

			gapi.hangout.data.setValue(key, JSON.stringify({person: person}));
		}

	});

});