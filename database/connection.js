const knexfile = require('../knexfile.js');
const connection = require('knex')(knexfile.development);

module.exports = connection;