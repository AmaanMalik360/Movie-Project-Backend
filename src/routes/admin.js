const express = require('express');
const { changePermission, getAllUsers, getAllUserPermissions, getAllPermissions} = require('../controllers/admin');
const { requireSignin, checkPermissions } = require('../middlewares/authorization');
const router = express.Router()

router.get('/users', requireSignin, getAllUsers); 
router.patch('/change-permission/:id', requireSignin, checkPermissions, changePermission); // :id is adminId
router.get('/all-user-permissions', requireSignin, getAllUserPermissions); // To get the PivotTable containing all the occurences of permissions. A User is selected.
router.get('/all-permissions', requireSignin, getAllPermissions); // To get all the permissions.

module.exports = router