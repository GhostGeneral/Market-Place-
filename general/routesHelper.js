var config = require('../config');

exports.allowOnly = function(accessLevel, callback) {
    function checkUserRole(req, res) {
        
        if( (accessLevel == req.groupId) || ( (accessLevel.length > 1) ? accessLevel.indexOf(req.groupId) >= 0 : false ) || (req.groupId == config.accessLevels.super_admin) ) {

            callback(req, res);

        } else {
            res.status(403).json({success: false, message:'Access denied!'});
            return;
        }

        
    }

    return checkUserRole;
};