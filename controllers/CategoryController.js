var models = require('../models');

var Category = {};


//create new category
Category.CreateCategory = function(req, res){
    if(!req.body.title) return res.json({success: false, message: 'Please provide title'});

    var data = req.body;
    models.Categories.create(data)
    .then(function(result){
        return res.json({success: true, message: 'Product Category successfully created'})
    }).catch(function(err){
        return res.json({success: false, message: 'Oops! Error occurred'})
    })
}

//list all categories
Category.ListCategories = function(req, res){
    models.Categories.findAll().then(function(categories){
        return res.json({success: true, message: 'Processed', data: categories});
    }).catch(function(err){
        return res.json({success: false, message: 'Error occurred'});
    })
}

//edit category
Category.EditCategory = function(req, res){
    if(!req.body.id || !req.body.title) return res.json({success: false, message: 'Please provide required fields'});

    var categoryId = req.body.id;
    models.Categories.findByPk(categoryId)
    .then(function(category){
        if(!category) return res.json({success: false, message: 'Category not found'});

        var data = req.body;
        category.update(data);
        return res.json({success: true, message: 'Update successful'});
    }).catch(function(err){
        return res.json({success: false, message: 'Error occurred'});
    })
}

//delete category
Category.DeleteCategory = function(req, res){
    if(!req.body.id) return res.json({success: false, message: 'Please provide required fields'});

    var categoryId = req.body.id;
    models.Categories.findByPk(categoryId)
    .then(function(category){
        if(!category) return res.json({success: false, message: 'Category not found'});

        category.destroy();
        return res.json({success: true, message: 'Delete successful'});
    }).catch(function(err){
        return res.json({success: false, message: 'Error occurred'});
    })
}

//get category by ID
Category.GetCategoryById = function(req, res){
    if(!req.params.id) return res.json({success: false, message: 'Please provide by category ID'});

    var categoryId = req.params.id;
    models.Categories.findByPk(categoryId)
    .then(function(category){
        if(!category) return res.json({success: false, message: 'Category not found'});

        return res.json({success: true, message: 'Processed', data: category})
    }).catch(function(err){
        return res.json({success: false, message: 'Error occurred'})
    })
}

module.exports = Category;