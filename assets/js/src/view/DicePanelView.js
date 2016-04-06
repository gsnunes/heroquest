define([

	'text!template/DicePanelView.html',
	'view/component/NewPanelView'

], function (html, NewPanelView) {

	'use strict';

	return NewPanelView.extend({

		className: 'dice-panel',


		initialize: function () {
			this.combatDice = {
				1: 'sprite-dice icon-skull',
				2: 'sprite-dice icon-skull',
				3: 'sprite-dice icon-skull',
				4: 'sprite-dice icon-shield',
				5: 'sprite-dice icon-shield',
				6: 'sprite-dice icon-black-shield'
			};
		},


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
			var diceOption = this.$('input[name="dice-options"]:checked').val(),
				len = this.$('#count-dice').val(),
				result = '',
				total = 0,
				random,
				i;

			for (i = 0; i < len; i++) {
				random = Math.floor((Math.random() * 6) + 1);
				total += random;

				if (diceOption === 'movement') {
					result += '<i class="sprite-move-dice icon-' + random + '"></i>';

					if (i < (len - 1)) {
						result += ' + ';
					}
					else {
						result += ' = ' + total;
					}
				}
				else {
					result += '<i class="sprite-dice icon-' + this.combatDice[random] + '"></i>';
					//result += this.combatDice[random];

					if (i < (len - 1)) {
						result += '&nbsp;';
					}
				}
			}

			this.$('.dice-result span').html(result.split(' = ')[0]);
			this.animateDice(result, diceOption);
			ev.preventDefault();
		},


		animateDice: function (result, diceOption) {
			var i = 0,
				len = 10,
				interval,
				_this = this;

			interval = setInterval(function () {
				var random = Math.floor((Math.random() * 6) + 1);

				if (diceOption === 'movement') {
					_this.$('.dice-result span i').removeClass().addClass('sprite-move-dice icon-' + random);
				}
				else {
					_this.$('.dice-result span i').removeClass().addClass('sprite-dice icon-' + _this.combatDice[random]);
				}

				if (i === len) {
					clearInterval(interval);
					_this.$('.dice-result span').html(result);
					gapi.hangout.data.setValue('history-' +  (new Date()).getTime(), JSON.stringify({message: result, person: gapi.hangout.getLocalParticipant().person}));
				}
				else {
					i++;
				}
			}, 100);
		},


		animateDiceDuration: function (index) {
			var _this = this,
				random = Math.floor((Math.random() * 6) + 1);

			setTimeout(function () {
				_this.$('.dice-result span i').removeClass().addClass('sprite-move-dice icon-' + random);
				_this.animateDice(index + 1);
			}, 100);
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