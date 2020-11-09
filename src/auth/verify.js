const jwt = require('jsonwebtoken');
const key = require('./key/.key.json').key;

module.exports = function(req, res, next) {
    try {
        const decode = jwt.verify(req.headers.x_token, key);
        if(decode.auth === 1) {
            next();
        }

    } catch(err) {
        if(err.name === "TokenExpiredError") {
            return res.json({ error: "Token expired", error_code: 24});

        } else {
            return res.json({ error: err.name, error_code: 1 });

        }
        
    }
}