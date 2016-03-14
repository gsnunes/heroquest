define([

	'text!template/JukeboxTabView.html'

], function (html) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		events: {
			'click .stop': function (ev) {
				var id = $(ev.target).parents('li').attr('id');
				this.stopTrack(id);

				gapi.hangout.data.clearValue(id);
			},
			'click .play-now': function (ev) {
				var oEmbed = $(ev.target).parents('li').data('oEmbed');
				this.playTrack(oEmbed);

				gapi.hangout.data.setValue('jukebox-' + oEmbed.randomId, JSON.stringify(oEmbed));
			},
			'click .add-track': 'embedTrack',
			'click .remove-track': 'removeTrack'
		},


		initialize: function () {
			this.load = false;

			this.bindEvents();

			SC.initialize({
				client_id: 'c846a9e67cb901619c96c9d06fb0f2e2'
			});
		},


		afterRender: function () {
			this.populatePlaying();
		},


		createTab: function () {
			if (!this.load) {
				this.populatePlaylist();
				this.load = true;
			}
		},


		populatePlaying: function () {
			var state = gapi.hangout.data.getState(),
				_this = this;

			_.each(state, function (value, key) {
				if (key.match(/jukebox/gi)) {
					_this.playTrack(JSON.parse(value));
				}
			});
		},


		bindEvents: function () {
			var i,
				len,
				value,
				currentMeta,
				_this = this;

			gapi.hangout.data.onStateChanged.add(_.bind(function (ev) {
				if (ev.addedKeys.length) {
					len = ev.addedKeys.length;

					for (i = 0; i < len; i++) {
						currentMeta = ev.addedKeys[i];

						if (currentMeta.key.match(/jukebox/gi) && currentMeta.lastWriter !== gapi.hangout.getLocalParticipant().id) {
							value = JSON.parse(currentMeta.value);
							_this.playTrack(value);
						}
					}
				}
				else if (ev.removedKeys.length) {
					len = ev.removedKeys.length;

					for (i = 0; i < len; i++) {
						if (ev.removedKeys[i].match(/jukebox/gi)) {
							_this.stopTrack(ev.removedKeys[i]);
						}
					}
				}
			}, this));
		},


		stopTrack: function (id) {
			this.$('.playing').find('#' + id).remove();
		},


		playTrack: function (oEmbed) {
			var item = $('<li id="jukebox-' + oEmbed.randomId + '">' + oEmbed.html.replace('visual=true&', '').replace('height=\"400\"', 'height=\"80\"') + '<button type="button" class="btn btn-danger btn-xs stop">stop</button></li>');

			this.$('.playing').append(item);
			item.data('oEmbed', oEmbed);
		},


		populatePlaylist: function () {
			var data = JSON.parse(localStorage.getItem('heroquest-playlist')) || [],
				len = data.length,
				i;

			this.$('.playlist').html('');

			for (i = 0; i < len; i++) {
				this.addTrack(data[i]);
			}
		},


		updateLocalStorage: function () {
			var data = this.$('.playlist li'),
				i, len = data.length,
				value = [];

			for (i = 0; i < len; i++) {
				value.push($(data[i]).data('oEmbed'));
			}

			localStorage.setItem('heroquest-playlist', JSON.stringify(value));
		},


		removeTrack: function (ev) {
			$(ev.target).parents('li').remove();
			this.updateLocalStorage();
		},


		embedTrack: function (ev) {
			var _this = this,
				trackUrl = $(ev.target).parents('.input-group').find('.track-url').val();

			ev.preventDefault();

			SC.oEmbed(trackUrl, {
				auto_play: true,
				single_active: false,
				show_artwork: false,
				buying: false,
				sharing: false,
				download: false,
				show_playcount: false,
				show_user: false,
				show_bpm: false,
				show_comments: false,
				default_width: 415
			}).then(function (oEmbed) {
				oEmbed.randomId = (new Date()).getTime();

				_this.addTrack(oEmbed);
				_this.updateLocalStorage();
				$(ev.target).parents('.input-group').find('.track-url').val('');
			}).catch(function (error) {
				alert('Error: ' + error.message);
			});
		},


		addTrack: function (oEmbed) {
			var item = $('<li class="list-group-item"><span class="pull-right btn-toolbar"><button type="button" class="btn btn-success btn-xs play-now">play now</button><button type="button" class="btn btn-danger btn-xs remove-track">remove</button></span>' + oEmbed.author_name + ' - ' + oEmbed.title + '</li>');
			this.$('.playlist').append(item);
			item.data('oEmbed', oEmbed);
		}

	});

});
