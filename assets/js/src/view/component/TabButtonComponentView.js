define([

	'text!template/component/TabButtonComponentView.html'

], function (html) {

	'use strict';

	return Giraffe.View.extend({

		className: 'tab-button-component',


		template: html,


		events: {
			'click label.btn': 'showContainer'
		},


		add: function (title, content, active, callback) {
			var id = (new Date()).getTime(),
				$li = $('<label class="btn btn-primary ' + (active ? 'active' : '') + '"><input type="radio" data-content-id="tab-button-content-' + id + '" autocomplete="off" ' + (active ? 'checked' : '') + '>' + title + '</label>');

			this.$('.btn-group').append($li);
			this.$('.tab-button-container').append('<div class="tab-button-content ' + (active ? '' : 'hide') + '" id="tab-button-content-' + id + '"></div>');

			content.attachTo(this.$('#tab-button-content-' + id));

			$li.on('click', function () {
				if (callback) {
					callback();
				}
			});
		},


		showContainer: function (ev) {
			this.$('.tab-button-content').addClass('hide');
			this.$('#' + $(ev.target).find('input').data('contentId')).removeClass('hide');
		}

	});

});