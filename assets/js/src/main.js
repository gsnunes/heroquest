window.GLOBAL = (function () {

	'use strict';

	document.oncontextmenu = function () {
		return false;
	};
	


	Backbone.EventBus = _.extend({}, Backbone.Events);



	var _sync = Backbone.sync;
	Backbone.sync = function (method, model, options) {
		var access_token = gapi.auth.getToken('token', true).access_token;

		if (model && options) {
			if (method === 'read') {
				options.url = _.result(model, 'url') + '?access_token=' + access_token;
			}

			if (method === 'create' || method === 'update' || method === 'patch' || method === 'delete') {
				options.contentType = 'application/json';
				options.data = options.attrs || model.toJSON();
				options.data = JSON.stringify(_.extend(options.data, {access_token: access_token}));
			}
		}

		return _sync.call(this, method, model, options);
	};



	require(['App'], function (App) {

		gapi.hangout.onApiReady.add(function (event) {
			if (event.isApiReady) {
				var participant = gapi.hangout.getLocalParticipant();

				GLOBAL.participant = participant;
				//GLOBAL.displayIndex = participant.displayIndex;
				GLOBAL.displayIndex = 1;

				gapi.auth.init(function () {
					gapi.auth.authorize({client_id: '463313181619-am93i896938m50fci3sg6teo26m5skiu.apps.googleusercontent.com', immediate: true, scope: 'https://www.googleapis.com/auth/plus.login'}, function () {
						var myApp = new App();
						myApp.attachTo('#app-wrapper').start();
					});
				});

			}
		});

	});



	return {

		config: {},
		host: util.getHost()

	};

}());