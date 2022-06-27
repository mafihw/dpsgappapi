const db = require('../db');

let permissionManager = {};


permissionManager.hasPermission = async (userId, permissionId) => {
        let userHasRights = false;
        try {
            let permissionList = await db.getUserPermissions(userId);
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
    canEditOtherUsers: "canEditOtherUsers",
    canEditDrinks: "canEditDrinks",
    canEditPurchases: "canEditPurchases",
    canSeeAllPurchases: "canSeeAllPurchases",
    canPayForOthers: "canPayForOthers",
    canEditRoles: "canEditRoles",
    canEditPermissions: "canEditPermissions"
}

module.exports = permissionManager;