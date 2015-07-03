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

module.exports = function (req, res, next) {

	'use strict';

	// User is allowed, proceed to the next policy,
	// or if this is the last policy, the controller

	if (!req.param('access_token')) {
		return res.send(403);
	}

	request('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + req.param('access_token'), function (err, resp, body) {
		if (err) {
			return res.send(404);
		}

		if (resp.statusCode !== 200) {
			return res.send(401);
		}
		else {
			var me;

			try {
				me = JSON.parse(body);
			}
			catch (e) {
				return res.send(400);
			}

			//Added values to create
			if (req.body) {
				if (req.body.personId && req.body.personId !== me.id) {
					return res.send(403);
				}
				else {
					req.body.person = me;
					req.body.personId = me.id;
					delete req.body.access_token;
				}
			}

			//Added where to find
			if (req.query) {
				if (req.query.access_token) {
					delete req.query.access_token;
				}
			}
			
			return next();
		}
	});

	// User is not allowed
	// (default res.forbidden() behavior can be overridden in `config/403.js`)
	//return res.forbidden('You are not permitted to perform this action.');
	
};
