define([

	'text!template/component/TabComponentView.html'

], function (html) {

	'use strict';

	return Giraffe.View.extend({

		template: html,


		add: function (title, content, active, callback) {
			var id = 'tab' + (new Date()).getTime(),
				$li = $('<li role="presentation" ' + (active ? 'class="active"' : '') + '><a href="#' + id + '" aria-controls="' + id + '" role="tab" data-toggle="tab">' + title + '</a></li>');

			this.$('.nav-tabs').append($li);
			this.$('.tab-content').append('<div role="tabpanel" class="tab-pane ' + (active ? 'active' : '') + '" id="' + id + '"></div>');

			content.attachTo(this.$('.tab-content #' + id));

			$li.on('click', function () {
				if (callback) {
					callback();
				}
			});

			/*
			$li.on('hide.bs.tab', function (e) {
				console.log(e);
			});
			*/
		}

	});

});