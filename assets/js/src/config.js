require.config({
	urlArgs: 'bust=' + (new Date()).getTime(),
	deps: ['main'],
	paths: {
		'jquery': '../../bower_components/jquery/dist/jquery.min',
		'jquery-i18n': '../../bower_components/jquery-i18n/jquery.i18n.min',
		'jquery-ui': '../../bower_components/jquery-ui/jquery-ui.min',
		'bootstrap': '../../bower_components/bootstrap/dist/js/bootstrap.min',
		'requireLib': '../../bower_components/requirejs/require',
		'giraffe': '../../bower_components/backbone.giraffe/dist/backbone.giraffe.min',
		'lodash': '../../bower_components/lodash/lodash.min',
		'backbone': '../../bower_components/backbone/backbone-min',
		'text': '../../bower_components/requirejs-text/text',

		'moment': '../../bower_components/moment/min/moment.min',

		'template': '../../templates',

		'util': 'util'
	},
	shim: {
		'jquery-i18n': {
			deps: ['jquery']
		},
		'jquery-ui': {
			deps: ['jquery-i18n']
		},
		'bootstrap': {
			deps: ['jquery-ui']
		},
		'lodash': {
			deps: ['bootstrap']
		},
		'backbone': {
			deps: ['lodash']
		},
		'giraffe': {
			deps: ['backbone']
		},
		'util': {
			deps: ['giraffe']
		},
		'main': {
			deps: ['util']
		}
	},
	config: {
		text: {
			//http://rockycode.com/blog/cross-domain-requirejs-text/
			useXhr: function () {
				return true; // jshint ignore:line
			}
		}
	},
	preserveLicenseComments: false,
	include: ['requireLib'],
	out: 'main-built.js'
});