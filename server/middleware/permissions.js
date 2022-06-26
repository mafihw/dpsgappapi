const db = require('../db');

let permissionManager = {};


permissionManager.hasPermission = (permissionId) => {
    return async (req, res, next) => {
        let userHasRights = false;
        try {
            let permissionList = await db.getUserPermissions(req.userData.userId);
            permissionList.forEach(element => {
                if(element.id == permissionId) {
                    userHasRights = true;
                }
            });
            if(userHasRights) {
              next();
            } else {
                return res.status(403).send({
                    msg: 'Forbidden resource!'
                });
            }
        } catch (error) {
            return res.status(500).send({
                msg: 'Internal server error!'
            });
        }
    }
},

permissionManager.perms = {
    canGetAllUsers: "canGetAllUsers",
    canPurchaseForOthers: "canPurchaseForOthers",
    canRegisterUsers: "canRegisterUsers",
    canEditOtherUser: "canEditOtherUsers",
    canEditDrinks: "canEditDrinks",
    canEditPurchases: "canEditPurchases",
    canSeeAllPurchases: "canSeeAllPurchases",
    canPayForOthers: "canPayForOthers",
    canEditRoles: "canEditRoles",
    canEditPermissions: "canEditPermissions"
}

module.exports = permissionManager;