const db = require('../db');

let permissionManager = {};


permissionManager.hasPermission = async (permissionId) => {
        let userHasRights = false;
        try {
            let permissionList = await db.getUserPermissions(req.userData.userId);
            permissionList.forEach(element => {
                if(element.id == permissionId) {
                    userHasRights = true;
                }
            });
            return userHasRights;
        } catch (error) {
            return false;
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