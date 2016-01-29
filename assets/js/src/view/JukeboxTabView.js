define([

	'text!template/JukeboxTabView.html'

], function (html) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		events: {
			'click .play-now': 'playTrack',
			'click .stop': 'stop'
		},


		initialize: function () {
			SC.initialize({
				client_id: 'c846a9e67cb901619c96c9d06fb0f2e2'
			});
		},


		createTab: function () {
			this.populatePlaylist();
		},


		/**
		 * populatePlaylist
		 */
		populatePlaylist: function () {
			var _this = this,
				track_url = 'http://soundcloud.com/forss/flickermood',
				track_url2 = 'http://soundcloud.com/travisscott-2/wonderful-ftthe-weeknd';

			this.$('.playlist').html('');

			this.embedTrack(track_url, function () {
				_this.embedTrack(track_url2);
			});
		},


		stop: function (ev) {
			$(ev.target).parents('li').remove();
		},


		playTrack: function (ev) {
			var oEmbed = $(ev.target).parents('li').data('oEmbed');
			this.$('.playing').append('<li>' + oEmbed.html.replace('visual=true&', '').replace('height=\"400\"', 'height=\"80\"') + '<button type="button" class="btn btn-danger btn-xs stop">stop</button></li>')
		},


		addTrack: function (oEmbed) {
			var item = $('<li>' + oEmbed.author_name + ' - ' + oEmbed.title + ' <button type="button" class="btn btn-xs play-now">play now</button></li>');
			this.$('.playlist').append(item);
			item.data('oEmbed', oEmbed);
		},


		embedTrack: function (track_url, callback) {
			var _this = this;

			SC.oEmbed(track_url, {
				auto_play: true,
				single_active: false,
				show_artwork: false,
				buying: false,
				show_bpm: false,
				sharing: false,
				download: false,
				show_bpm: false,
				show_playcount: false,
				show_user: false,
				show_playcount: false,
				show_bpm: false,
				show_comments: false,
				default_width: 415
			}).then(function (oEmbed) {
				_this.addTrack(oEmbed);

				if (callback) {
					callback();
				}
			});
		}

	});

});
