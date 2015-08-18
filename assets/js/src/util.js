util = (function () {

	'use strict';

	return {

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


		removeAllMasterPiecesFromBoard: function () {
			var stateMetadata = gapi.hangout.data.getStateMetadata(),
				keys = [];

			_.each(stateMetadata, function (state, key) {
				if (key.match(/piece/gi)) {
					var value = JSON.parse(state.value);

					if (!value.model || !value.model.person) {
						keys.push(key);
					}
				}
			});

			gapi.hangout.data.submitDelta(null, keys);
		}

	};

}());