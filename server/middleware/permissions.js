const db = require('../db');

module.exports = {
    hasPermission: (permissionId) => {
        return (req, res, next) => {
            try {
                permissionList = db.getUserPermissions(req.userData.userId);
                if(permissionList.includes(permissionId)) {
                    next();
                }else {
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

    perms: {
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

}