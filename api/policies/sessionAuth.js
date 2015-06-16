/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

var request = require('request');

module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller

  	if (!req.param('access_token')) {
  		return res.forbidden('You are not permitted to perform this action.');
  	}

	request('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + req.param('access_token'), function (err, res, body) {
		if (err) {
			return err;
		}

		if (res.statusCode !== 200) {
			return new Error('Invalid access token: ' + body);
		}
		else {
			var me;

			try {
				me = JSON.parse(body);
			}
			catch (e) {
				return new Error('Unable to parse user data: ' + e.toString());
			}

			//Added values to create
			if (req.body) {
				req.body.person = me;
				req.body.personId = me.id;
			}

			//Added where to find
			if (req.query) {
				if (req.query.access_token) {
					delete req.query.access_token;
					req.query.personId = me.id;
				}
			}
			
			return next();
		}
	});



  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
};
