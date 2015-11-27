define([

	'text!template/ArtifactsTabButtonView.html',
	'view/component/ListGroupComponentView'

], function (html, ListGroupComponentView) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		initialize: function () {
			this.bindEvents();
		},


		afterRender: function () {
			this.populateParticipants();
			this.createListGroup();
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
				this.$('.btn-primary').prop('disabled', true);
			}
			else {
				this.$('.btn-primary').prop('disabled', false);
			}
		},


		createListGroup: function () {
			var listGroupComponentView = new ListGroupComponentView();
			listGroupComponentView.attachTo(this);

			_.each(this.data, _.bind(function (value) {
				var $item = $('<a href="#" class="list-group-item"><h4 class="list-group-item-heading">' + value.name + '</h4><p class="list-group-item-text">' + value.description + '</p><div class="btn-toolbar pull-right" role="toolbar"><button type="button" class="btn btn-primary btn-xs found-artifact">Found</button></div><div class="clearfix"></div></a>');
				listGroupComponentView.addItem($item);

				$item.find('.btn-primary').on('click', value, _.bind(function (ev) {
					var message = 'found the artifact <b>' + ev.data.name + '</b> (' + ev.data.description + ')',
						person = gapi.hangout.getParticipantById(this.$('#participants').val()).person;

					gapi.hangout.data.setValue('history-' +  (new Date()).getTime(), JSON.stringify({message: message, person: person}));
				}, this));
			}, this));
		}

	});

});
