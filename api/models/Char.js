/**
* Hero.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name: 'string',
	inventory: 'string',
	character: 'string',
	quests: 'integer',
	person: 'json',
	movement: 'integer',
	attack: 'integer',
	defense: 'integer',
	body: 'integer',
	mind: 'integer',
	personId: 'string'
  }

};