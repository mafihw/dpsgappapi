const db = require('../db');

module.exports = {
    hasPermission: (req, res, next, permissionId) => {
        try {
            permissionList = db.getUserPermissions(req.userData.userId);
            if(permissionList.includes(permissionId)) {
                next();
            }else {
                res.sendStatus(403);
            }
        } catch (error) {
            res.sendStatus(500);
        }
    },

    perms: {
        canGetAllUsers,
        canPurchaseForOthers,
        canRegisterUsers,
        canEditOtherUsers,
        canEditDrinks,
        canEditPurchases,
        canSeeAllPurchases,
        canPayForOthers,
        canEditRoles,
        canEditPermissions
    }

}