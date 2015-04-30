util = (function () {

	'use strict';

	return {

		getHost: function () {
			var host = '';

			$(document.scripts).each(function () {
				if ($(this).attr('id') === 'main') {
					host = $(this).attr('src').split('/')[2];
					return false;
				}
			});

			return host;
		}

	};

}());