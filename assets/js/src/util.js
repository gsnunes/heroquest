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
		}

	};

}());