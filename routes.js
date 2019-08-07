let config = require('./config');
let VerifyToken = require('./general/verifytoken');
let allowOnly = require('./general/routesHelper').allowOnly;



//controllers
let AuthController = require('./controllers/AuthController');
let GroupsController = require('./controllers/GroupsController');
let CategoryController = require('./controllers/CategoryController');

let APIRoutes = function(router){
    // auth controller route
    router.post('/auth/register',AuthController.Register);

    router.post('/auth/login',AuthController.Login);

    router.post('/auth/forgot_password', AuthController.ForgotPassword);

    router.post('/auth/reset_password', AuthController.ResetPassword);

    router.get('/auth/activate_account/:token', AuthController.ActivateAccount);

    // user controller route
    router.put('/users/updateMyProfile', VerifyToken, AuthController.UpdateMyProfile);

    //GROUPS CONTROLLER ROUTES
    router.get('/groups/all', VerifyToken, allowOnly(config.accessLevels.internal_staff, GroupsController.GetAll));

    router.get('/groups/public/all', GroupsController.GetPublicGroups);

    router.get('/groups/getbyalias/:alias', GroupsController.GetByAlias);

        //Categories ROUTES
        router.post('/admin/categories/add', VerifyToken, allowOnly(config.accessLevels.internal_staff, CategoryController.CreateCategory));

        router.get('/categories/list', CategoryController.ListCategories);
    
        router.put('/admin/categories/edit', VerifyToken, allowOnly(config.accessLevels.internal_staff, CategoryController.EditCategory));
    
        router.delete('/admin/categories/delete', VerifyToken, allowOnly(config.accessLevels.internal_staff, CategoryController.DeleteCategory));
    
        router.get('/categories/getById/:id', CategoryController.GetCategoryById);

    return router;
}
module.exports = APIRoutes;