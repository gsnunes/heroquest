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
						if (ev.addedKeys[i].key.match(/treasure-/gi)) {
							this.manageTreasure(ev.addedKeys[i]);
						}
					}
				}
			}, this));
		},


		manageTreasure: function (state) {
			var value = JSON.parse(state.value),
				participant = gapi.hangout.getLocalParticipant();

			console.log(value);
			console.log(participant.person.id === value.person.id);
			console.log(!value.disabled);

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
			util.setValue(historyKey, JSON.stringify({message: message, person: value.person, pvt: true}), 300, function () {
				value.disabled = true;
				gapi.hangout.data.setValue(key, JSON.stringify(value));
			});
		},


		foundTreasure: function (key, value) {
			var message = 'found the treasure ' + value.treasure.name,
				boughtTreasuresValue = gapi.hangout.data.getValue('boughtTreasures'),
				boughtTreasures = boughtTreasuresValue ? JSON.parse(boughtTreasuresValue) : [];

			util.setValue('history-' + (new Date()).getTime(), JSON.stringify({message: message, person: value.person}), 300, function () {
				value.disabled = true;
				gapi.hangout.data.setValue(key, JSON.stringify(value));
			});

			if (!value.treasure.remains) {
				boughtTreasures.push(value.treasure.id);
				gapi.hangout.data.setValue('boughtTreasures', JSON.stringify(boughtTreasures));
			}
		},


		buyTreasure: function (ev) {
			var key = $(ev.target).attr('id'),
				boughtTreasure = util.getTreasure(),
				value = JSON.parse(gapi.hangout.data.getValue(key));

			if (!value.treasure) {
				$(ev.target).off();
				$(ev.target).remove();
				gapi.hangout.data.clearValue($(ev.target).data('historyKey'));

				value.disabled = false;
				value.treasure = boughtTreasure;
				gapi.hangout.data.setValue(key, JSON.stringify(value));
			}
		}

	});

});