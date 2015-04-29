define([

	'text!template/HistoryPanelView.html',
	'view/component/PanelView',
	'model/HistoryModel',
	'collection/HistoryCollection'

], function (Template, PanelView, HistoryModel, HistoryCollection) {

	'use strict';

	return PanelView.extend({


		className: 'history-panel',


		historyCollection: new HistoryCollection(),


		treasures: ['gold', 'potion', 'errante'],


		initialize: function () {
			PanelView.prototype.initialize.apply(this, arguments);

			this.token = gapi.auth.getToken('token', true);

			this.setContent();
			this.setTitle();

			var self = this;
			gapi.hangout.data.onStateChanged.add(function (ev) {
				self.updateHistory(ev);
			});

			Backbone.EventBus.on('HistoryPanel.setTitle', this.updateCampaing, this);
		},


		updateHistory: function (ev) {
			if (ev.addedKeys.length && this.isPiece(ev.addedKeys[0].key)) {
				var value = ev.addedKeys[0].value;

				$('.history-panel .history-list').append('<li>' + value + '</li>');

				this.updateScroll();
			}
		},


		/**
		 * updateScroll
		 */
		updateScroll: function () {
			$('.history-panel').animate({ scrollTop: $('.history-panel').get(0).scrollHeight }, "slow");
		},


		addHistoryItem: function (msg, data) {
			var participant = gapi.hangout.getLocalParticipant(),
				model = {message: msg, campaing_id: GLOBAL.campaingModel.attributes.id, date: (new Date()).toString(), access_token: this.token.access_token, displayIndex: GLOBAL.displayIndex},
				historyModel = new HistoryModel(model),
				self = this;

			this.historyCollection.create(historyModel, {
				wait: true,

				success : function (ev) {
					var name = 'Zargon (' + participant.person.displayName + ')',
						date = moment(new Date(ev.attributes.date)).format('MM-DD-YYYY, h:mm:ss a'),
						message = date + ' ' + name + ' - ';

					message += ev.attributes.message;

					if (data && data.type === 'TREASURE') {
						if (data.personId === participant.person.id) {
							var treasureId = 'treasure-' + (new Date()).getTime();
							message += ' <a href="javascript:;" class="check-treasure" id="' + treasureId + '">Clique aqui!</a>';

							$(document).on('click', '#' + treasureId, function () {
								var treasureFound = Math.floor((Math.random() * self.treasures.length));

								self.addHistoryItem('estava procurando por tesouros e encontrou um ' + self.treasures[treasureFound]);

								if (self.treasures[treasureFound] !== 'errante') {
									self.treasures.splice(treasureFound, 1);
								}

								$(this).remove();
							});
						}
					}

					/*
					if (GLOBAL.displayIndex > 0) {

					}
					*/

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


		setContent: function () {
			this.options.content = Template;
		},


		updateCampaing: function (campaingName) {
			$('.history-panel .history-list').html('');
			this.$el.find('.history-panel .panel-title').html(('History - ' + campaingName) || 'History');
		},
		

		setTitle: function () {
			this.options.title = 'History';
		}

	});

});