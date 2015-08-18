define(function () {

	'use strict';

	return Giraffe.View.extend({

		initialize: function () {
			this.treasure = _.shuffle(GLOBAL.data.treasure);
			this.bindEvents();
		},


		bindEvents: function () {
			gapi.hangout.data.onStateChanged.add(_.bind(function (ev) {
				if (ev.addedKeys.length) {
					for (var i = 0, len = ev.addedKeys.length; i < len; i++) {
						if (ev.addedKeys[i].key.match(/treasure/gi)) {
							this.manageTreasure(ev.addedKeys[i]);
						}
					}
				}
			}, this));
		},


		manageTreasure: function (state) {
			var value = JSON.parse(state.value),
				participant = gapi.hangout.getLocalParticipant();

			if (participant.person.id === value.person.id) {
				if (value.treasure) {
					this.foundTreasure(value);
				}
				else {
					this.unlockDeck(state.key, value);
				}
			}
		},


		unlockDeck: function (key, value) {
			var historyKey = 'history-' + (new Date()).getTime(),
				message = '"I am searching for treasure." <a href="javascript:;" id="' + key + '" data-history-key="' + historyKey + '">click here</a>';

			$(document).on('click', '#' + key, _.bind(this.buyTreasure, this));
			gapi.hangout.data.setValue(historyKey, JSON.stringify({message: message, person: value.person, pvt: true}));
		},


		foundTreasure: function (value) {
			var message = 'found the treasure ' + value.treasure.name;
			gapi.hangout.data.setValue('history-' + (new Date()).getTime(), JSON.stringify({message: message, person: value.person}));

			if (!value.treasure.remains) {
				this.treasure = _.filter(this.treasure, function (data) {
					return data.id !== value.treasure.id;
				});
			}
		},


		buyTreasure: function (ev) {
			var key = $(ev.target).attr('id'),
				historyKey = $(ev.target).data('historyKey'),
				value = JSON.parse(gapi.hangout.data.getValue(key)),
				boughtTreasure = this.treasure[Math.floor((Math.random() * this.treasure.length))],
				person = gapi.hangout.getLocalParticipant().person;

			if (!value.treasure) {
				gapi.hangout.data.clearValue(historyKey);
				$(ev.target).remove();
				$(ev.target).off();

				gapi.hangout.data.setValue($(ev.target).attr('id'), JSON.stringify({person: person, treasure: boughtTreasure}));
			}
		}

	});

});