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



	$.fn.serializeObject = function () {
		var o = {},
			a = this.serializeArray();

		$.each(a, function () {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});

		return o;
	};



	require(['App'], function (App) {

		gapi.hangout.onApiReady.add(function (event) {
			if (event.isApiReady) {
				var participant = gapi.hangout.getLocalParticipant(),
					clientId = '463313181619-am93i896938m50fci3sg6teo26m5skiu.apps.googleusercontent.com';

				if (util.getEnv() === 'test') {
					clientId = '235382286790-t3ijhq35kbdccuuc93og4ajdll9oilai.apps.googleusercontent.com';
				}

				GLOBAL.participant = participant;
				GLOBAL.displayIndex = participant.displayIndex;
				//GLOBAL.displayIndex = 1;

				gapi.auth.init(function () {
					gapi.auth.authorize({client_id: clientId, immediate: true, scope: 'https://www.googleapis.com/auth/plus.login'}, function () {
						var myApp = new App();
						myApp.attachTo('#main-script', {method: 'before'}).start();
					});
				});
			}
		});

	});



	return {

		config: {},

		host: util.getHost(),

		data: util.getMock()

	};

}());