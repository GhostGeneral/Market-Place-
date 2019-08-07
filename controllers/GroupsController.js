var models = require('../models');
var Group = {};

//get all the user groups. Only admin has access to this.
Group.GetAll = function(req, res){
    models.Group.findAll({}).then(function(groups){
        return res.json({success:true, data: groups});
    }).catch(function(err){
        return res.json({success:false, message: 'Failed to process request'});
    })
}

//get the public user groups.
Group.GetPublicGroups = function(req, res){
    models.Group.findAll({
        where:{
            alias:{
                $or: ['business', 'customer']
            }
        }
    }).then(function(groups){
        return res.json({success:true, data: groups});
    }).catch(function(err){
        return res.json({success:false, message: 'Failed to process request'});
    })
}

//get single group by alias
Group.GetByAlias = function(req, res){

    if(!req.params.alias) return res.json({success:false, message: 'Please provide alias'});

    var aliasName = req.params.alias;
    models.Group.findOne({
        where:{
            alias: aliasName
        }
    }).then(function(group){
        if(!group) return res.json({success: false, message: 'No group found'});

        return res.json({success: true, data: group});
    }).catch(function(err){
        return res.json({success:false, message: 'Failed to process request'});
    })
}

Group.GetById = function(id = null, callback){
    models.Group.findById(id)
    .then(function(group){
        callback(group);
    }).catch(function(err){
        callback(false);
    });
}

module.exports = Group;