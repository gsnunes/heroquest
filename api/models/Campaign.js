/**
* Campaign.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name: 'string',
	description: 'string',
	person: 'json',
	personId: 'string',
	state: 'json',
	url: 'string'
  }
  
};

