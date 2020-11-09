const jwt = require('jsonwebtoken');
const key = require('./key/.key.json').key;

module.exports = function(req, res, next) {
    const token = jwt.sign({ auth: 1 }, key, {
        expiresIn: 300
    });
    return res.json({ token });

}