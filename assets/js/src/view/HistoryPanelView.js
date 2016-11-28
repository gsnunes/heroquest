define([

	'text!template/HistoryPanelView.html',
	'view/component/NewPanelView',
	'moment',
	'collection/CampaingCollection',
	'view/CampaingListModalView'

], function (html, NewPanelView, moment, CampaingCollection, CampaingListModalView) {

	'use strict';

	return NewPanelView.extend({


		className: 'history-panel',


		initialize: function () {
			this.bindEvents();
		},


		afterRender: function () {
			NewPanelView.prototype.afterRender.apply(this, arguments);
			this.setTitleCampaing();
			this.setBody(html);
			this.populate();
		},


		populate: function () {
			this.populateHistoryPerf(gapi.hangout.data.getStateMetadata());
		},


		/**
		 * populateHistoryPerf
		 */
		populateHistoryPerf: function (stateMetadata, increment) {
			var state = _.sortBy(_.filter(stateMetadata, function (i) {
				return i.key.match(/history/gi);
			}), function (i) {
				return i.timestamp;
			}),
			participant = gapi.hangout.getLocalParticipant(),
			i, len = state.length,
			history = [],
			value,
			row;

			for (i = 0; i < len; i++) {
				value = JSON.parse(state[i].value);
				row = null;

				if (value.pvt) {
					if (participant.person.id === value.person.id) {
						row = this.getHinstoryRow(state[i], value);
					}
				}
				else {
					row = this.getHinstoryRow(state[i], value);
				}

				if (row) {
					history.push(this.getHinstoryRow(state[i], value));
				}
			}

			if (increment) {
				this.$('ul').append(history.join(''));
			}
			else {
				this.$('ul').html(history.join(''));
			}
			
			this.updateScroll();
		},


		bindEvents: function () {
			gapi.hangout.data.onStateChanged.add(_.bind(function (ev) {
				if (ev.addedKeys.length) {
					this.populateHistoryPerf(ev.addedKeys, true);

					var i = 0, len = ev.addedKeys.length;

					for (i = 0; i < len; i++) {
						if (ev.addedKeys[i].key.match(/campaing/gi) || ev.addedKeys[i].key.match(/updateTitle/gi)) {
							this.setTitleCampaing();
						}
					}
				}
				else if (ev.removedKeys.length) {
					for (var i = 0, len = ev.removedKeys.length; i < len; i++) {
						if (ev.removedKeys[i].match(/history/gi)) {
							if (this.$el.find('#' + ev.removedKeys[i]).length) {
								this.$el.find('#' + ev.removedKeys[i]).remove();
							}
						}

						if (ev.removedKeys[i].match(/campaing/gi)) {
							this.setTitleCampaing();
						}
					}
				}
			}, this));
		},


		setTitleCampaing: function () {
			var campaingId = gapi.hangout.data.getValue('campaing');

			if (campaingId) {
				this.getCampaingModel(campaingId, _.bind(function (campaingModel) {
					if (campaingModel) {
						this.setTitle('History (<span data-toggle="tooltip" data-placement="top" title="' + campaingModel.attributes.description + '">' + campaingModel.attributes.name + ' <span class="glyphicon glyphicon-info-sign"></span></span>)');
						this.$('[data-toggle="tooltip"]').tooltip({html: true});
					}
					else {
						this.setTitle('History');
					}
				}, this));
			}
			else {
				if (util.isMaster()) {
					this.setTitle('History <button type="button" class="btn btn-default btn-xs" data-toggle="tooltip" data-placement="top" title="This hangout instance has a unique URL never saved. Like master you can create a campaing attached on this URL, for write notes, save the board state and share with other players.">Create a campaing</button>');
					this.$('button.btn-default').tooltip();
					this.$('button.btn-default').on('click', function () {
						var campaingListModalView = new CampaingListModalView();
						campaingListModalView.open();
					});
				}
				else {
					this.setTitle('History');
				}
			}
		},


		getCampaingModel: function (campaingId, callback) {
			var campaingCollection = new CampaingCollection();

			campaingCollection.fetch({
				success: _.bind(function () {
					if (callback) {
						callback(campaingCollection.get(campaingId));
					}
				}, this)
			});
		},


		addItem: function (state) {
			var participant = gapi.hangout.getLocalParticipant(),
				value = JSON.parse(state.value);

			if (value.pvt) {
				if (participant.person.id === value.person.id) {
					this.$('ul').append(this.getHinstoryRow(state, value));
				}
			}
			else {
				this.$('ul').append(this.getHinstoryRow(state, value));
			}

			this.updateScroll();
		},


		getHinstoryRow: function (state, value) {
			var date = '<span class="gray-light">' + moment(Number(state.timestamp)).format('MM-DD-YYYY, h:mm a') + ' </span>',
				name = value.person.displayName;

			return '<li id="' + state.key + '">' + date + '<b>' + name + '</b>: ' + value.message + '</li>';
		},


		updateScroll: function () {
			this.$('.panel-body').animate({scrollTop: this.$('.panel-body').get(0).scrollHeight}, 'fast');
		}

	});

});