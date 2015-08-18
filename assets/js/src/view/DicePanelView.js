define([

	'text!template/DicePanelView.html',
	'view/component/NewPanelView',
	'view/component/AlertModalView',
	'view/component/ConfirmModalView'

], function (html, NewPanelView, AlertModalView, ConfirmModalView) {

	'use strict';

	return NewPanelView.extend({

		className: 'dice-panel',


		events: function () {
			return _.extend({}, NewPanelView.prototype.events, {
				'submit form[name="form-dice"]': 'roll',
				'change input[name="dice-options"]': 'setForm',
				'keypress #count-dice': 'onEnterPress'
			});
		},


		afterRender: function () {
			NewPanelView.prototype.afterRender.apply(this, arguments);

			this.setBody(html);
			this.setTitle('Dice Roller');
		},


		roll: function (ev) {
			ev.preventDefault();

			var newModal = new ConfirmModalView({body: 'xxx', callback: function () {
				console.log('aqui');
			}});
			newModal.open();
			//newModal.show();


			/*
			var combatDice = {
					1: 'Caveira',
					2: 'Caveira',
					3: 'Caveira',
					4: 'Escudo',
					5: 'Escudo',
					6: 'Besouro'
				},
				diceOption = this.$('input[name="dice-options"]:checked').val(),
				len = this.$('#count-dice').val(),
				result = '',
				total = 0,
				random,
				i;

			for (i = 0; i < len; i++) {
				random = Math.floor((Math.random() * 6) + 1);
				total += random;

				if (diceOption === 'movement') {
					result += random;

					if (i < (len - 1)) {
						result += ' + ';
					}
					else {
						result += ' = ' + total;
					}
				}
				else {
					result += combatDice[random];

					if (i < (len - 1)) {
						result += ' + ';
					}
				}
			}

			gapi.hangout.data.setValue('history-' +  (new Date()).getTime(), JSON.stringify({message: 'roll ' + result, person: GLOBAL.participant.person}));

			this.$('.dice-result span').html(result);
			*/
			ev.preventDefault();
		},


		setForm: function (ev) {
			this.$('#count-dice').focus();

			if ($(ev.target).filter(':checked').val() === 'movement') {
				this.$("#count-dice").val(2);
			}
		},
		

		onEnterPress: function (ev) {
			if (ev.which === 13) {
				ev.preventDefault();
				$('form[name="form-dice"]').submit();
			}
		}

	});

});