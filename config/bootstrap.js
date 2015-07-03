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

module.exports.bootstrap = function (cb) {
	
	'use strict';

	/*
	Character.find().exec(function (err, result) {
		var characters = [
			{name: 'Barbarian', description: 'Arma inicial: Espada larga; \nArmadura inicial: Nenhuma;', moviment: 2, attack: 3, defense: 2, body: 8, mind: 2},
			{name: 'Elf', description: 'Arma inicial: Espada curta; \nArmadura inicial: Nenhuma;', moviment: 2, attack: 2, defense: 2, body: 6, mind: 4},
			{name: 'Dwarf', description: 'Arma inicial: Adaga; \nArmadura inicial: Nenhuma;', moviment: 2, attack: 2, defense: 2, body: 7, mind: 3},
			{name: 'Wizard', description: 'Arma inicial: Adaga; \nArmadura inicial: Nenhuma;', moviment: 2, attack: 1, defense: 2, body: 4, mind: 6}
		];

		if (result.length && result.length === characters.length) {
			return false;
		}

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
	*/

	cb();

};
