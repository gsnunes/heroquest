define([

	'text!template/PiecesPanelView.html',
	'view/component/PanelView',
	'view/CampaingListModalView',
	'view/CharListModalView'

], function (Template, PanelView, CampaingListModalView, CharListModalView) {

	'use strict';

	return PanelView.extend({

		pieceTemplate: _.template(Template),


		className: 'pieces-panel',


		events: function () {
			return _.extend({}, PanelView.prototype.events, {
				'click ul.pieces-toolbar li': 'highlight',
				'keyup body': 'unselect',
				'click #settings-tab .btn-default': 'openList',
				'click #cards-tab .btn-cards .btn': 'toggleCards',
				'click .send-treasure': 'sendTreasure',
				'click .use-chaos': 'useChaos',
				'click .found-artifact': 'foundArtifact'
			});
		},


		/**
		 * foundArtifact
		 */
		foundArtifact: function (ev) {
			var cardName = $(ev.target).parents('a').find('.list-group-item-heading').text(),
				cardText = $(ev.target).parents('a').find('.list-group-item-text').text();

			GLOBAL.historyPanelView.addHistoryItem('A hero found the artifact:' + cardName + ' - ' + cardText);
		},


		/**
		 * useChaos
		 */
		useChaos: function (ev) {
			var cardName = $(ev.target).parents('a').find('.list-group-item-heading').text(),
				cardText = $(ev.target).parents('a').find('.list-group-item-text').text();

			GLOBAL.historyPanelView.addHistoryItem('used the chaos spell:' + cardName + ' - ' + cardText);
		},


		/**
		 * sendTreasure
		 */
		sendTreasure: function (ev) {
			ev.preventDefault();

			var select = $('#cards-tab .options-content #treasure-participants');

			GLOBAL.historyPanelView.addHistoryItem(select[0].textContent + ' está procurando por um tesouro!', {personId: select.val(), type: 'TREASURE'});
		},


		toggleCards: function (ev) {
			var active = $(ev.target).find('input').attr('id');

			$('#cards-tab .options-content').find('.option').addClass('hide');
			$('#cards-tab .options-content #' + active + '-content').removeClass('hide');
		},


		openList: function (ev) {
			ev.preventDefault();
			
			if (GLOBAL.displayIndex === 0) {
				var campaingListModalView = new CampaingListModalView();
				campaingListModalView.show();
			}
			else {
				var charListModalView = new CharListModalView();
				charListModalView.show();
			}
		},


		initialize: function () {
			PanelView.prototype.initialize.apply(this, arguments);

			this.setContent();
			this.setTitle();

			Backbone.EventBus.on('PiecesPanel.SettingsTab.setName', this.populateSettings, this);
		},


		onTabChange: function () {
			this.setTreasureParticipants();
		},


		setTreasureParticipants: function () {
			var participants = gapi.hangout.getParticipants(),
				i, len = participants.length,
				options = [];

			for (i = 0; i < len; i++) {
				options.push('<option value="' + participants[i].person.id + '">' + participants[i].person.displayName + '</option>');
			}

			$('#cards-tab .options-content #treasure-participants').html(options.join());
		},


		populateSettings: function (name) {
			$('#settings-tab #settings-name').val(name);
		},


		setContent: function () {
			this.options.content = this.pieceTemplate();
		},


		setTitle: function () {
			this.options.title = 'Master Toolbar';
		},


		highlight: function (ev) {
			$(ev.currentTarget).toggleClass('highlight').siblings().removeClass('highlight');
		},
		

		unselect: function (ev) {
			if (ev.keyCode === 27) {
				$('ul.pieces-toolbar li').removeClass('highlight');
			}
		}

	});

});