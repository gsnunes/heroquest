/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
	
	'use strict';

	Character.find().exec(function(err, result) {
		var characters = [
			{name: 'Barbarian', description: 'Adaga', attr: {mo: 2, a: 3, d: 2, b: 8, m: 2}, hasSpell: false},
			{name: 'Elf', description: 'Adaga', attr: {mo: 2, a: 2, d: 2, b: 6, m: 4}, hasSpell: true},
			{name: 'Dwarf', description: 'Adaga', attr: {mo: 2, a: 2, d: 2, b: 7, m: 3}, hasSpell: false},
			{name: 'Wizard', description: 'Adaga', attr: {mo: 2, a: 1, d: 2, b: 4, m: 6}, hasSpell: true}
		];

		if (result.length && result.length === characters.length) { return false; }

		Character.destroy(function (err) {
			if (err) {
				cb(err);
			}

			Character.create(characters, function (err) {
				if (err) {
					cb(err);
				}

				console.log('bootstrap created characters');
			});
		});
	});


	cb();

};
