define([

	'text!template/HistoryPanelView.html',
	'view/component/NewPanelView',
	'model/HistoryModel',
	'collection/HistoryCollection',
	'moment'

], function (html, NewPanelView, HistoryModel, HistoryCollection, moment) {

	'use strict';

	return NewPanelView.extend({


		className: 'history-panel',


		historyCollection: new HistoryCollection(),


		treasures: ['gold', 'potion', 'errante'],


		initialize: function () {
			NewPanelView.prototype.initialize.apply(this, arguments);

			this.token = gapi.auth.getToken('token', true);

			var self = this;
			gapi.hangout.data.onStateChanged.add(function (ev) {
				self.updateHistory(ev);
			});

			Backbone.EventBus.on('HistoryPanel.setTitle', this.updateCampaing, this);
		},


		/**
		 * afterRender
		 */
		afterRender: function () {
			NewPanelView.prototype.afterRender.apply(this, arguments);

			this.setBody(html);
			this.setTitle('History');
		},


		updateHistory: function (ev) {
			if (ev.addedKeys.length && this.isPiece(ev.addedKeys[0].key)) {
				var value = ev.addedKeys[0].value,
					participant = gapi.hangout.getLocalParticipant(),
					personId,
					treasureId = 'treasure-' + (new Date()).getTime(),
					self = this;

				if ($(value).hasClass('treasure')) {
					personId = $(value).find('span.treasure-user-name').data('personId');

					if (participant.person.id === personId) {
						value = $('<div>').append($(value).append('<a id="' + treasureId + '" href="javascript:;" class="check-treasure"> Clique aqui!</a>')).html();
						$(document).on('click', '#' + treasureId, function () {
							var treasureFound = Math.floor((Math.random() * self.treasures.length));

							self.addHistoryItem('estava procurando por tesouros e encontrou um ' + self.treasures[treasureFound]);

							if (self.treasures[treasureFound] !== 'errante') {
								self.treasures.splice(treasureFound, 1);
							}

							$(this).off();
							$(this).remove();
						});
					}
				}

				this.$('.history-list').append('<li>' + value + '</li>');

				this.updateScroll();
			}
		},


		/**
		 * updateScroll
		 */
		updateScroll: function () {
			this.$('.panel-body').animate({ scrollTop: this.$('.panel-body').get(0).scrollHeight }, "slow");
		},


		addHistoryItem: function (msg, data) {
			var participant = gapi.hangout.getLocalParticipant(),
				model = {message: msg, campaing_id: GLOBAL.campaingModel.attributes.id, date: (new Date()).toString(), access_token: this.token.access_token, displayIndex: GLOBAL.displayIndex},
				historyModel = new HistoryModel(model),
				self = this;

			this.historyCollection.create(historyModel, {
				wait: true,

				success : function (ev) {
					var name = GLOBAL.charModel ? ('<b>' + GLOBAL.charModel.attributes.name + ' (' + participant.person.displayName + ')</b>') : '<b>Zargon (' + participant.person.displayName + ')</b>',
						date = '<span class="gray-light">' + moment(new Date(ev.attributes.date)).format('MM-DD-YYYY, h:mm:ss a') + '</span>',
						message = date + ' ' + name + ': ';

					if ($('<div>' + ev.attributes.message + '</div>').hasClass('treasure')) {
						message = $('<div>').append($(ev.attributes.message).prepend(message)).html();
					}
					else {
						message += ev.attributes.message;
					}

					var historyKey = 'history-item-' + (new Date()).getTime();
					gapi.hangout.data.setValue(historyKey, message);
				}
			});
		},


		isPiece: function (key) {
			if (key.match(/history-item-/gi)) {
				return true;
			}

			return false;
		},


		updateCampaing: function (campaingName) {
			this.$('.history-list').html('');
			this.$('.panel-title').html(('History - ' + campaingName) || 'History');
		}

	});

});