define([

	'view/component/ListGroupComponentView'

], function (ListGroupComponentView) {

	'use strict';

	return Giraffe.View.extend({

		afterRender: function () {
			var listGroupComponentView = new ListGroupComponentView();
			listGroupComponentView.attachTo(this);

			_.each(this.data, _.bind(function (value) {
				var $item = $('<a href="#" class="list-group-item"><h4 class="list-group-item-heading">' + value.name + '</h4><p class="list-group-item-text">' + value.description + '</p><div class="btn-toolbar pull-right" role="toolbar"><button type="button" class="btn btn-primary btn-xs found-artifact">Cast spell</button></div><div class="clearfix"></div></a>');
				listGroupComponentView.addItem($item);

				$item.find('.btn-primary').on('click', value, function (ev) {
					var message = 'cast the spell ' + ev.data.name + ' (' + ev.data.description + ')';
					gapi.hangout.data.setValue('history-' +  (new Date()).getTime(), JSON.stringify({message: message, person: GLOBAL.participant.person}));
				});
			}, this));
		}

	});

});