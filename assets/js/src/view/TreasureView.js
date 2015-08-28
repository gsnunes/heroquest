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

			if (participant.person.id === value.person.id && !value.disabled) {
				if (value.treasure) {
					this.foundTreasure(state.key, value);
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


		foundTreasure: function (key, value) {
			var message = 'found the treasure ' + value.treasure.name,
				boughtTreasuresValue = gapi.hangout.data.getValue('boughtTreasures'),
				boughtTreasures = boughtTreasuresValue ? JSON.parse(boughtTreasuresValue) : [];

			gapi.hangout.data.setValue('history-' + (new Date()).getTime(), JSON.stringify({message: message, person: value.person}));

			value.disabled = true;
			gapi.hangout.data.setValue(key, JSON.stringify(value));

			//if (!value.treasure.remains) {
				gapi.hangout.data.setValue('boughtTreasures', JSON.stringify(boughtTreasures.push(value.treasure.id)));
			//}
		},


		buyTreasure: function (ev) {
			var key = $(ev.target).attr('id'),
				boughtTreasure = util.getTreasure(),
				historyKey = $(ev.target).data('historyKey'),
				person = gapi.hangout.getLocalParticipant().person,
				value = JSON.parse(gapi.hangout.data.getValue(key));

			if (!value.treasure) {
				gapi.hangout.data.clearValue(historyKey);
				$(ev.target).remove();
				$(ev.target).off();

				gapi.hangout.data.setValue($(ev.target).attr('id'), JSON.stringify({person: person, treasure: boughtTreasure}));

				value.disabled = true;
				gapi.hangout.data.setValue(key, JSON.stringify(value));
			}
		}

	});

});