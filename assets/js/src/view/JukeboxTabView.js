define([

	'text!template/JukeboxTabView.html'

], function (html) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		events: {
			'click .stop': 'stop',
			'click .play-now': 'playTrack',
			'click .add-track': 'embedTrack',
			'click .remove-track': 'removeTrack'
		},


		initialize: function () {
			this.load = false;

			SC.initialize({
				client_id: 'c846a9e67cb901619c96c9d06fb0f2e2'
			});
		},


		createTab: function () {
			if (!this.load) {
				this.populatePlaylist();
				this.load = true;
			}
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


		stop: function (ev) {
			$(ev.target).parents('li').remove();
		},


		playTrack: function (ev) {
			var oEmbed = $(ev.target).parents('li').data('oEmbed');
			this.$('.playing').append('<li>' + oEmbed.html.replace('visual=true&', '').replace('height=\"400\"', 'height=\"80\"') + '<button type="button" class="btn btn-danger btn-xs stop">stop</button></li>')
		},


		addTrack: function (oEmbed) {
			var item = $('<li class="list-group-item"><span class="pull-right btn-toolbar"><button type="button" class="btn btn-success btn-xs play-now">play now</button><button type="button" class="btn btn-danger btn-xs remove-track">remove</button></span>' + oEmbed.author_name + ' - ' + oEmbed.title + '</li>');
			this.$('.playlist').append(item);
			item.data('oEmbed', oEmbed);
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
				_this.updateLocalStorage();
				$(ev.target).parents('.input-group').find('.track-url').val('');
			}).catch(function (error){
				alert('Error: ' + error.message);
			});
		}

	});

});
