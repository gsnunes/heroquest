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
			var state = gapi.hangout.data.getStateMetadata();

			state = _.sortBy(state, function (a) {
				return a.timestamp;
			});

			_.each(state, _.bind(function (data) {
				if (data.key.match(/history/gi)) {
					this.addItem(data);
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
					}
				}
			}, this));
		},


		setTitleCampaing: function () {
			var campaing = parseInt(gapi.hangout.data.getValue('campaing'), 10);

			if (campaing) {
				console.log(campaing);
				this.getCampaingModel(campaing, _.bind(function (campaingModel) {
					console.log(campaingModel);
					this.setTitle('History (' + campaingModel.attributes.name + ')');
				}, this));
			}
			else {
				if (util.isMaster()) {
					this.setTitle('History <button type="button" class="btn btn-warning btn-xs" data-toggle="tooltip" data-placement="top" title="Select a campaing to save the game changes">select a campaing</button>');
					this.$('button.btn-warning').tooltip();
					this.$('button.btn-warning').on('click', function () {
						var campaingListModalView = new CampaingListModalView();
						campaingListModalView.open();
					});
				}
				else {
					this.setTitle('History');
				}
			}
		},


		getCampaingModel: function (campaing, callback) {
			var campaingCollection = new CampaingCollection();

			campaingCollection.fetch({
				success: _.bind(function () {
					if (callback) {
						console.log(campaingCollection);
						callback(campaingCollection.get(campaing));
					}
				}, this)
			});
		},


		addItem: function (state) {
			var date = '<span class="gray-light">' + moment(state.timestamp).format('MM-DD-YYYY, h:mm a') + '</span>',
				participant = gapi.hangout.getLocalParticipant(),
				value = JSON.parse(state.value),
				name = value.person.displayName;

			if (value.pvt) {
				if (participant.person.id === value.person.id) {
					this.$('ul').append('<li id="' + state.key + '"><b>' + name + '</b>: ' + value.message + '</li>');
				}
			}
			else {
				this.$('ul').append('<li id="' + state.key + '"><b>' + name + '</b>: ' + value.message + '</li>');
			}

			this.updateScroll();
		},


		updateScroll: function () {
			this.$('.panel-body').animate({scrollTop: this.$('.panel-body').get(0).scrollHeight}, 'slow');
		}

	});

});