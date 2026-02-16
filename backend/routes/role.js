const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { isAuthenticatedUser, authorizePermission } = require('../middleware/auth');

// Protect all routes
router.use(isAuthenticatedUser);

router.route('/roles')
    .get(authorizePermission('roles.view'), roleController.getAllRoles)
    .post(authorizePermission('roles.edit'), roleController.createRole);

router.route('/roles/:id')
    .put(authorizePermission('roles.edit'), roleController.updateRole)
    .delete(authorizePermission('roles.edit'), roleController.deleteRole);

module.exports = router;
