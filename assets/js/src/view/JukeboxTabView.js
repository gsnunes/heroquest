define([

	'text!template/JukeboxTabView.html'

], function (html) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		events: {
			'click .add-track': 'embedTrack',
			'click .glyphicon-remove': 'removeTrack',
			'click .playlist .glyphicon-stop': function (ev) {
				var oEmbed = $(ev.target).parents('li').data('oEmbed');
				gapi.hangout.data.clearValue('jukebox-' + oEmbed.id);
			},
			'click .playlist .glyphicon-play': function (ev) {
				var oEmbed = $(ev.target).parents('li').data('oEmbed');

				this.playTrack(oEmbed);
				gapi.hangout.data.setValue('jukebox-' + oEmbed.id, JSON.stringify(oEmbed));
			}
		},


		initialize: function () {
			this.load = false;
			this.players = {};

			this.bindEvents();

			SC.initialize({
				client_id: 'c846a9e67cb901619c96c9d06fb0f2e2'
			});
		},


		afterRender: function () {
			this.createTab();
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


		toggleList: function () {
			if (this.$('.playing ul li').length) {
				this.$('.playing').removeClass('hide');
			}
			else {
				this.$('.playing').addClass('hide');
			}
		},


		stopTrack: function (id) {
			if (id && this.players[id.substr(8)]) {
				if ($('.playlist #' + id).find('.glyphicon-stop').length) {
					$('.playlist #' + id).find('.glyphicon-stop').removeClass('glyphicon-stop').addClass('glyphicon-play');
				}

				this.$('.playing ul').find('#' + id).remove();
				this.players[id.substr(8)].pause();
				this.players[id.substr(8)].seek(0);
				this.toggleList();
			}
		},


		playTrack: function (oEmbed) {
			var _this = this,
				soundPlayer,
				item = $('<li id="jukebox-' + oEmbed.id + '" class="list-group-item"><div class="pull-right"><span class="glyphicon glyphicon-stop"></span><a href="' + oEmbed.permalink_url + '" title="Go to SoundCloud track" target="_blank"><span class="glyphicon glyphicon-cloud"></span></a></div>' + oEmbed.title + '</li>');

			if ($('.playlist #jukebox-' + oEmbed.id).find('.glyphicon-play')) {
				$('.playlist #jukebox-' + oEmbed.id).find('.glyphicon-play').removeClass('glyphicon-play').addClass('glyphicon-stop');
			}

			this.$('.playing ul').append(item);
			item.data('oEmbed', oEmbed);
			this.toggleList();

			SC.stream('/tracks/' + oEmbed.id).then(function (player) {
				if (!_this.$('.volume').slider('instance')) {
					_this.$('.volume').slider({value: 20, slide: function (event, ui) {
						player.setVolume(parseFloat((ui.value / 100).toFixed(1)));
					}});

					player.setVolume(0.2);
				}

				item.find('.glyphicon-stop').on('click', function (ev) {
					var id = $(ev.target).parents('li').attr('id');
					gapi.hangout.data.clearValue(id);
				});

				player.on('finish', function () {
					_this.stopTrack('jukebox-' + oEmbed.id);
				});

				_this.players[oEmbed.id] = player;
				player.play();
			});
		},


		populatePlaylist: function () {
			var data = JSON.parse(localStorage.getItem('heroquest-playlist')) || [],
				len = data.length,
				i;

			this.$('.playlist').html('');

			if (len) {
				for (i = 0; i < len; i++) {
					this.addTrack(data[i]);
				}
			}
			else {
				this.$('.no-data').removeClass('hide');
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

			if (this.$('.playlist').is(':empty')) {
				this.$('.no-data').removeClass('hide');
			}
		},


		embedTrack: function (ev) {
			var _this = this,
				trackUrl = $(ev.target).parents('.input-group').find('.track-url').val();

			ev.preventDefault();

			SC.resolve(trackUrl).then(function (oEmbed) {
				if (oEmbed.kind !== 'track') {
					throw {message: 'Only allow tracks'};
				}

				_this.addTrack(oEmbed);
				_this.updateLocalStorage();
				$(ev.target).parents('.input-group').find('.track-url').val('');
			}).catch(function (error) {
				alert('Error: ' + error.message);
				$(ev.target).parents('.input-group').find('.track-url').val('');
			});
		},


		addTrack: function (oEmbed) {
			var item = $('<li id="jukebox-' + oEmbed.id + '" class="list-group-item"><span class="pull-right"><span class="glyphicon glyphicon-play" title="Play"></span><a href="' + oEmbed.permalink_url + '" title="Go to SoundCloud track" target="_blank"><span class="glyphicon glyphicon-cloud"></span></a><span class="glyphicon glyphicon-remove" title="Remove track"></span></span>' + oEmbed.title + '</li>');
			this.$('.no-data').addClass('hide');
			this.$('.playlist').append(item);
			item.data('oEmbed', oEmbed);
		}

	});

});
