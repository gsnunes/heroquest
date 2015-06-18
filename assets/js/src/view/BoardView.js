define([

	'view/MonsterPopoverView',
	'collection/CharCollection'

], function (MonsterPopoverView, CharCollection) {

	'use strict';

	return Giraffe.View.extend({


		className: 'board',


		events: {
			'click': 'setPices'
		},


		monsters: {
			'icon-chaos-warrior': {title: 'Chaos Warrior', attr: {mo: 7, a: 4, d: 4, b: 3, m: 3}},
			'icon-fimir': {title: 'Fimir', attr: {mo: 6, a: 3, d: 3, b: 2, m: 3}},
			'icon-gargoyle': {title: 'Gargoyle', attr: {mo: 6, a: 4, d: 5, b: 3, m: 4}},
			'icon-goblin': {title: 'Goblin', attr: {mo: 10, a: 2, d: 1, b: 1, m: 1}},
			'icon-mummy': {title: 'Mummy', attr: {mo: 4, a: 3, d: 4, b: 2, m: 0}},
			'icon-orc': {title: 'Orc', attr: {mo: 8, a: 3, d: 2, b: 1, m: 2}},
			'icon-skeleton': {title: 'Skeleton', attr: {mo: 6, a: 2, d: 2, b: 1, m: 0}},
			'icon-zombie': {title: 'Zombie', attr: {mo: 5, a: 2, d: 3, b: 1, m: 0}}
		},


		characters: {
			'icon-barbarian': {title: 'Barbarian', attr: {mo: 7, a: 4, d: 4, b: 3, m: 3}},
			'icon-elf': {title: 'Elf', attr: {mo: 6, a: 3, d: 3, b: 2, m: 3}},
			'icon-dwarf': {title: 'Dwarf', attr: {mo: 6, a: 4, d: 5, b: 3, m: 4}},
			'icon-wizard': {title: 'Wizard', attr: {mo: 10, a: 2, d: 1, b: 1, m: 1}}
		},


		charCollection: new CharCollection(),


		initialize: function () {
			var self = this;

			gapi.hangout.data.onStateChanged.add(function (ev) {
				self.changePieces(ev);
			});

			Backbone.EventBus.on('BoardView.AddCharPiece', this.addCharPiece, this);
		},


		addCharPiece: function (charModel) {
			var pieceId = 'piece-' + (new Date()).getTime(),
				pieceIcon = 'sprite-characters icon-' + charModel.attributes.character.toLowerCase(),
				piece;

			piece = '<div id="' + pieceId + '" data-char-id="' + charModel.attributes.id.toString() + '" class="draggable piece" style="top:' + 300 + 'px; left:' + 300 + 'px;"><span class="glyphicon glyphicon-remove-circle remove-piece"></span><i class="' + pieceIcon + '"></i></div>';
			gapi.hangout.data.setValue(pieceId, piece);

			GLOBAL.historyPanelView.addHistoryItem('selected your character');
		},


		changePieces: function (ev) {
			if (ev.addedKeys.length && this.isPiece(ev)) {
				var value = $(ev.addedKeys[0].value),
					key = ev.addedKeys[0].key,
					wrapper = $('<div id="wrapper-' + key + '"></div>'),
					monster,
					character,
					monsterPopoverView,
					self = this,
					rotation = 0,
					recoupLeft, recoupTop;

				if (key === 'campaingId') {
					return false;
				}

				if (!$('.board #' + key).length) {
					wrapper.append(value);
					$('.board').append(wrapper);

					value.css({
						left: value.offset().left - (value.width() / 2) + $('#app-wrapper').get(0).scrollLeft,
						top: value.offset().top - (value.height() / 2) + $('#app-wrapper').get(0).scrollTop
					});
				}
				else {
					$('.board #' + key).attr('style', value.attr('style'));
				}

				//Drag fix when transforms in use
				//http://bugs.jquery.com/ticket/8362
				value.draggable({
					start: function (event, ui) {
						var left = parseInt($(this).css('left'),10);
						left = isNaN(left) ? 0 : left;
						var top = parseInt($(this).css('top'),10);
						top = isNaN(top) ? 0 : top;
						recoupLeft = left - ui.position.left;
						recoupTop = top - ui.position.top;
					},
					drag: function (event, ui) {
						ui.position.left += recoupLeft;
						ui.position.top += recoupTop;
					},
					containment: '.board',
					stop: this.stopDraggablePiece
				});

				monster = this.monsters[value.find('i').attr('class').split(' ').pop()];
				character = this.characters[value.find('i').attr('class').split(' ').pop()];

				if (monster) {
					wrapper.find('.piece').css('z-index', 1);
					monsterPopoverView = new MonsterPopoverView({el: wrapper, monster: monster, key: key});
					monsterPopoverView.render();
				} else if (character) {
					this.charCollection.fetch({
						success: function () {
							var charModel = self.charCollection.get(value.data('charId'));
							
							wrapper.find('.piece').css('z-index', 2);
							monsterPopoverView = new MonsterPopoverView({el: wrapper, monster: charModel.attributes, key: key});
							monsterPopoverView.render();
						}
					});
				}
				else {
					wrapper.find('.piece').css('z-index', 0);
				}

				value.on({
					mouseenter: function () {
						value.find('.remove-piece').show();
					},
					mouseleave: function () {
						value.find('.remove-piece').hide();
					}
				});

				value.on('mousedown', function (ev) {
					if (ev.button === 2) {
						rotation = rotation === 360 ? 90 : (rotation + 90);

						$(this).css({'-webkit-transform' : 'rotate('+ rotation +'deg)',
						'-moz-transform' : 'rotate('+ rotation +'deg)',
						'-ms-transform' : 'rotate('+ rotation +'deg)',
						'transform' : 'rotate('+ rotation +'deg)'});

						return false;
					}

					return true;
				});

				value.find('.remove-piece').on('click', function () {
					self.removePiece($(this).parents('.piece').attr('id'));
					wrapper.remove();
				});
			}
		},


		isPiece: function (ev) {
			if (ev.addedKeys[0].key.match(/history-item-/gi)) {
				return false;
			}

			if (ev.addedKeys[0].key.match(/popover-/gi)) {
				this.updatePopover(ev);
				return false;
			}

			return true;
		},


		/**
		 * updatePopover
		 */
		updatePopover: function (ev) {
			if (ev.addedKeys.length) {
				var value = ev.addedKeys[0].value,
					barClass = $(value).attr('class').split(' ')[1],
					key = ev.addedKeys[0].key,
					wrapper = key.split('-')[3];

				$('#wrapper-piece-' + wrapper).find('.popover .' + barClass).replaceWith(value);
			}
		},


		removePiece: function (id) {
			gapi.hangout.data.submitDelta(null, [id]);
		},


		stopDraggablePiece: function () {
			var delta = {};
			delta[$(this).attr('id')] = $('<div>').append($(this).clone()).html();

			gapi.hangout.data.submitDelta(delta);
		},
		

		setPices: function (ev) {
			if ($(ev.target).hasClass('board')) {
				var selectedItem = $('#myTabContent div.active ul.pieces-toolbar li.highlight'),
					pieceId, pieceIcon, piece;

				if (selectedItem.length) {
					pieceId = 'piece-' + (new Date()).getTime();
					pieceIcon = selectedItem.find('i').attr('class');
					piece = '<div id="' + pieceId + '" class="draggable piece" style="top:' + ev.offsetY + 'px; left:' + ev.offsetX + 'px;"><span class="glyphicon glyphicon-remove-circle remove-piece"></span><i class="' + pieceIcon + '"></i></div>';

					gapi.hangout.data.setValue(pieceId, piece);

					/*
					if (this.monsters[pieceIcon.split(' ').pop()]) {
						GLOBAL.historyPanelView.addHistoryItem('put a ' + this.monsters[pieceIcon.split(' ').pop()].title + ' on the board.');
					}
					else {
						GLOBAL.historyPanelView.addHistoryItem('put a piece on the board.');
					}
					*/					
				}
			}
		}

	});

});