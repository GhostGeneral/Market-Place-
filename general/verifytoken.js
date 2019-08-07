var jwt = require('jsonwebtoken');
var config = require('../config');

function verifyToken(req, res, next) {
    var token = req.headers['authorization'];
    if (!token){
        return res.status(403).json({ success: false, message: 'No token provided.' });
    }
    
    jwt.verify(token, config.jwt.secret, function(err, decoded) {
        if (err){
            return res.status(500).json({ success: false, message: 'Failed to authenticate token.' });
        }
        
        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        req.groupId = decoded.groupId;
        req.usergroupalias = decoded.usergroupalias;
        next();
    });
}
module.exports = verifyToken;