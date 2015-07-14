define([

	'text!template/component/TabButtonComponentView.html'

], function (html) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		events: {
			'click label.btn': 'showContainer'
		},


		add: function (title, content, active, callback) {
			var id = 'tab' + (new Date()).getTime(),
				$li = $('<label class="btn btn-primary ' + (active ? 'active' : '') + '"><input type="radio" id="option-' + id + '" autocomplete="off" ' + (active ? 'checked' : '') + '>' + title + '</label>');

			this.$('.btn-group').append($li);
			this.$('.tab-button-content').append('<div class="list-group ' + (active ? '' : 'hide') + '" id="list-group-option-' + id + '"></div>');

			content.attachTo(this.$('#list-group-option-' + id));

			$li.on('click', function () {
				if (callback) {
					callback();
				}
			});
		},


		showContainer: function (ev) {
			this.$('.list-group').addClass('hide');
			this.$('#list-group-' + $(ev.target).find('input').attr('id')).removeClass('hide');
		}

	});

});