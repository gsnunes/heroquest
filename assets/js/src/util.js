util = (function () {

	'use strict';

	return {

		buyTreasure: function (target) {
			var key = $(target).attr('id'),
				boughtTreasure = util.getTreasure(),
				value = JSON.parse(gapi.hangout.data.getValue(key));

			if (!value.treasure) {
				$(target).off();
				$(target).parent().remove();
				gapi.hangout.data.clearValue($(target).data('historyKey'));

				value.disabled = false;
				value.treasure = boughtTreasure;
				gapi.hangout.data.setValue(key, JSON.stringify(value));
			}
		},


		loadHide: function (instance) {
			instance.$('.modal-body-loaded').show();
			instance.$('.loading').hide();
		},


		loadShow: function (instance) {
			instance.$('.modal-body-loaded').hide();
			instance.$('.loading').show();
		},


		getHost: function () {
			var host = '';

			$(document.scripts).each(function () {
				if ($(this).attr('id') === 'main-script') {
					host = $(this).attr('src').split('/')[2];
					return false;
				}
			});

			return host;
		},


		getEnv: function () {
			var host = this.getHost().substr(0, 9),
				env = 'dev';

			if (host === 'test.hangouts.com') {
				env = 'test';
			}

			return env;
		},


		getMock: function () {
			var data = {};

			$.ajax({url: 'https://' + util.getHost() + '/mock.json', async: false}).success(function (result) {
				data = result;
			});

			return data;
		},


		getMaster: function () {
			var master = gapi.hangout.data.getValue('master');
			return master ? JSON.parse(master) : null;
		},


		isMaster: function () {
			var master = this.getMaster(),
				participant = gapi.hangout.getLocalParticipant();

			if (master && master.person.id === participant.person.id) {
				return true;
			}

			return false;
		},


		removeAllMasterPiecesFromBoard: function (filter) {
			var stateMetadata = gapi.hangout.data.getStateMetadata(),
				keys = [];

			_.each(stateMetadata, function (state, key) {
				if (key.match(new RegExp(filter, 'gi'))) {
					var value = JSON.parse(state.value);

					if (!value.model || !value.model.person) {
						keys.push(key);
					}
				}
			});

			gapi.hangout.data.submitDelta(null, keys);
		},


		clearState: function () {
			var stateMetadata = gapi.hangout.data.getStateMetadata(),
				keys = [];

			_.each(stateMetadata, function (state, key) {
				if (!key.match(/master/gi)) {
					keys.push(key);
				}
			});

			gapi.hangout.data.submitDelta(null, keys);
		},


		setValue: function (key, value, time, callback) {
			gapi.hangout.data.setValue(key, value);

			var interval = setInterval(function () {
				if (gapi.hangout.data.getValue(key)) {
					clearInterval(interval);

					if (callback) {
						callback();
					}
				}
			}, time);
		},


		submitDelta: function (obj, time, callback) {
			var keys = gapi.hangout.data.getKeys(),
				objKeys = _.keys(obj),
				newState = _.union(keys, objKeys),
				total = newState.length,
				interval;

			gapi.hangout.data.submitDelta(obj);

			interval = setInterval(function () {
				var currentKeys = gapi.hangout.data.getKeys();

				if (currentKeys.length === total) {
					clearInterval(interval);

					if (callback) {
						callback();
					}
				}
			}, time);
		},


		clearValue: function (key, time, callback) {
			gapi.hangout.data.clearValue(key);

			var interval = setInterval(function () {
				if (typeof gapi.hangout.data.getValue(key) === 'undefined') {
					clearInterval(interval);

					if (callback) {
						callback();
					}
				}
			}, time);
		},


		getTreasure: function (test) {
			var boughtTreasuresValue = gapi.hangout.data.getValue('boughtTreasures'),
				boughtTreasures = boughtTreasuresValue ? JSON.parse(boughtTreasuresValue) : null,
				treasures = _.shuffle(GLOBAL.data.treasure);

			if (boughtTreasures) {
				treasures = _.filter(treasures, function (data) {
					return !_.contains(boughtTreasures, data.id);
				});
			}

			return test ? treasures : treasures[Math.floor((Math.random() * treasures.length))];
		}

	};

}());