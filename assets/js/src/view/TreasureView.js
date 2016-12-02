define(function () {

	'use strict';

	return Giraffe.View.extend({

		events: {
			'click .buyTreasure': 'buyTreasure'
		},


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
				message = value.person.displayName + ' is searching for treasures. <a href="#" onclick="util.buyTreasure(this)" class="buyTreasure" id="' + key + '" data-history-key="' + historyKey + '">click here</a>';

			util.setValue(historyKey, JSON.stringify({message: message, person: value.person, pvt: true}), 300, function () {
				value.disabled = true;
				gapi.hangout.data.setValue(key, JSON.stringify(value));
			});
		},


		foundTreasure: function (key, value) {
			var message = 'found the treasure <b>' + value.treasure.name + '</b> (' + value.treasure.description + ')',
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
		}

	});

});
