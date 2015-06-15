/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }

  port: 1337,

  routes: {
  	'GET /': 'https://plus.google.com/hangouts/_?gid=463313181619'
  },

  ssl: {
    key: require('fs').readFileSync('./config/ssl/server.key'),
    cert: require('fs').readFileSync('./config/ssl/server.crt'),
    passphrase: 'phrase'
  }

};
