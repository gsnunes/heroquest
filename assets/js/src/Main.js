window.HEROQUEST = (function () {

	'use strict';

	Backbone.EventBus = _.extend({}, Backbone.Events);


	require.config({
		urlArgs: 'bust=' + (new Date()).getTime(),
		paths: {
			text: '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text.min',
			template: '../../templates'
		},
		config: {
			text: {
				//http://rockycode.com/blog/cross-domain-requirejs-text/
				useXhr: function () {
					return true;
				}
			}
		}
	});


	require([
		
		'view/AppView'

	], function (AppView) {

		gapi.hangout.onApiReady.add(function (event) {
			if (event.isApiReady) {

				gapi.auth.init(function () {
					gapi.auth.authorize({client_id: '1078284663077-gjmpbfiqcfbub0833citkunhjngdodbj.apps.googleusercontent.com', immediate: true, scope: 'https://www.googleapis.com/auth/plus.login'}, function () {
						var appView = new AppView();
						appView.render();
					});
				});

			}
		});

	});


	return {

		host: $('#main').attr('data-main').split('/')[2]

	};

}());