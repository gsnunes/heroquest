define([

	'text!template/HistoryPanelView.html',
	'view/component/NewPanelView',
	'moment'

], function (html, NewPanelView, moment) {

	'use strict';

	return NewPanelView.extend({


		className: 'history-panel',


		initialize: function () {
			this.bindEvents();
		},


		afterRender: function () {
			NewPanelView.prototype.afterRender.apply(this, arguments);
			this.setTitle('History');
			this.setBody(html);
			this.populate();
		},


		populate: function () {
			var state = gapi.hangout.data.getStateMetadata();

			_.each(state, _.bind(function (value, key) {
				if (key.match(/history/gi)) {
					this.addItem(value);
				}
			}, this));
		},


		bindEvents: function () {
			gapi.hangout.data.onStateChanged.add(_.bind(function (ev) {
				if (ev.addedKeys.length) {
					for (var i = 0, len = ev.addedKeys.length; i < len; i++) {
						if (ev.addedKeys[i].key.match(/history/gi)) {
							this.addItem(ev.metadata[ev.addedKeys[i].key]);
						}

						if (ev.addedKeys[i].key.match(/campaing/gi)) {
							this.setTitle('History - a');
						}
					}
				}
			}, this));
		},


		addItem: function (state) {
			var date = moment(state.timestamp).format('MM-DD-YYYY, h:mm a'),
				participant = gapi.hangout.getLocalParticipant(),
				value = JSON.parse(state.value),
				name = value.person.displayName;

			if (value.pvt) {
				if (participant.person.id === value.person.id) {
					this.$('ul').append('<li id="' + state.key + '"><span class="gray-light">' + date + '</span> <b>' + name + '</b>: ' + value.message + '</li>');
				}
			}
			else {
				this.$('ul').append('<li id="' + state.key + '"><span class="gray-light">' + date + '</span> <b>' + name + '</b>: ' + value.message + '</li>');
			}

			this.updateScroll();
		},


		updateScroll: function () {
			this.$('.panel-body').animate({scrollTop: this.$('.panel-body').get(0).scrollHeight}, 'slow');
		}

	});

});