const express = require('express');
const sign = require('./auth/sign');
const verify = require('./auth/verify');
const { create, get, count } = require('./controllers/FilesAndDbController')

const routes = express.Router();

routes.use('/docs', express.static('./docs'));
routes.use('/', express.static('./frontSide'));

routes.get('/getToken', sign);

routes.post('/create', verify, create);

routes.post('/get', verify, get);

routes.get('/getCounter', verify, count);

module.exports = routes;