const express = require('express');

const router = express.Router();

const db = require('../db');
const userMiddleware = require('../middleware/user.js');
const permissions = require('../middleware/permissions.js');
const { hashPassword } = require('../middleware/user.js');

// Deploy
router.post('/updateserver', (req, res, next) => {
    res.sendStatus(200);
    const { exec} = require('child_process');
    const child = exec('sudo /home/pi/updateserver.sh');
});

// Test
router.get('/test', (req, res, next) => {
    res.send("Success! You are connected!");
});

// Users
router.get('/user/:uuid', userMiddleware.isLoggedIn, async (req, res) => {
    if(req.userData.userId == req.params.uuid || await permissions.hasPermission(req.userData.userId, permissions.perms.canGetAllUsers)) {
        try {
            let results = await db.getUser(req.params.uuid);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403); 
    }
});

router.get('/user', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canGetAllUsers)) {
        try {
            let results = await db.allUsers();
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }      
    } else { 
        res.sendStatus(403);
    }
});

// Handled by auth.js 
/*router.post('/user', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canRegisterUsers)) {
        try {
            let results = await db.createUser(req.body.name, req.body.nickname, req.body.email);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});*/

router.patch('/user/:uuid', userMiddleware.isLoggedIn, async (req, res) => {
    let oldUserdata = await db.getUser(req.params.uuid);
    if(oldUserdata != null) {
        var canEditOtherUsers = await permissions.hasPermission(req.userData.userId, permissions.perms.canEditOtherUsers)
        if(canEditOtherUsers || req.userData.userId == req.params.uuid) {
            if(!canEditOtherUsers && (req.userData.userId != req.params.uuid || (req.body.roleId && req.body.roleId != oldUserdata.roleId) || (req.body.balance && req.body.balance != oldUserdata.balance) || (req.body.deleted && req.body.deleted != oldUserdata.deleted))) {
                res.sendStatus(403);
            } else {
                var newPasswordHash = null;
                var isEmailValid = true;
                var isEmailInUse = null;
                var emailValidPattern=/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                if(req.body.password && req.body.password.length >= 6) {
                    newPasswordHash = await hashPassword(req.body.password);
                }

                if(req.body.email && !emailValidPattern.test(req.body.email)) {
                    isEmailValid = false;
                } else if(req.body.email && req.body.email != oldUserdata.email) {
                    var emailCheckUser = await db.getUserByEmail(req.body.email);
                    isEmailInUse = emailCheckUser != null && emailCheckUser.id != oldUserdata.id;
                }

                if(!isEmailValid) {
                    res.status(400).send({
                        msg: 'Please enter a valid email address'
                    });
                }else if(isEmailInUse) {
                    res.status(400).send({
                        msg: 'Email address already in use'
                    });
                } else if((req.body.password && (req.body.password.length < 6 && req.body.password.length > 0))) {
                    res.status(400).send({
                        msg: 'Please enter a password with at least 6 chars'
                    });
                } else {
                    try {
                        let results = await db.updateUser(req.params.uuid, req.body.roleId, req.body.email, req.body.name, req.body.balance, req.body.weight, req.body.gender, newPasswordHash, req.body.deleted);
                        res.json(results);
                    } catch (error) {
                        res.sendStatus(500);
                    }
                }
            }
        }else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(404);
    }
});

router.delete('/user/:uuid', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canEditOtherUsers) || req.userData.userId == req.params.uuid) {
        try {
            let results = await db.deleteUser(req.params.uuid);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

// Permissions
router.get('/permissions', userMiddleware.isLoggedIn, async (req, res) => {
        try {
            let results = await db.getUserPermissions(req.userData.userId);
            let permissions = results.map(permission => permission.id);
            res.json(permissions);
        } catch (error) {
            res.sendStatus(500);
        }
});

// Purchases
router.get('/purchase/:id', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canSeeAllPurchases)) {
        try {
            let results = await db.getPurchase(req.params.id);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

router.get('/purchase', userMiddleware.isLoggedIn, async (req, res) => {  
    const filters = req.query;
    if(filters['userId'] == null) {
        if(await permissions.hasPermission(req.userData.userId, permissions.perms.canSeeAllPurchases)) {
            try {
                let results = await db.allPurchases(filters['from'], filters['to']);
                res.json(results);
            } catch (error) {
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(403);
        }
    } else {
        if(req.userData.userId == filters['userId'] || await permissions.hasPermission(req.userData.userId, permissions.perms.canSeeAllPurchases)) {
            try {
                let results = await db.getPurchasesByUser(filters['userId'], filters['from'], filters['to']);
                res.json(results);
            } catch (error) {
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(403);
        }
    }
});

router.post('/purchase', userMiddleware.isLoggedIn, async (req, res) => {
    if(req.userData.userId == req.body.uuid 
        || await db.getFriendshipExists(req.userData.userId, req.body.uuid, req.body.date)
        || await permissions.hasPermission(req.userData.userId, permissions.perms.canPurchaseForOthers)) {
        try {
            let results = await db.addPurchase(req.body.uuid, req.userData.userId, req.body.drinkid, req.body.amount, req.body.date);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});



// Payments
router.get('/payment/:id', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canSeeAllPurchases)) {
        try {
            let results = await db.getPayment(req.params.id);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

router.get('/payment', userMiddleware.isLoggedIn, async (req, res) => {
    const filters = req.query;
    if(filters['userId'] == null) {
        if(await permissions.hasPermission(req.userData.userId, permissions.perms.canSeeAllPurchases)) {
            try {
                let results = await db.allPayments(filters['from'], filters['to']);
                res.json(results);
            } catch (error) {
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(403);
        }
    } else {
        if(req.userData.userId == filters['userId'] || await permissions.hasPermission(req.userData.userId, permissions.perms.canSeeAllPurchases)) {
            try {
                let results = await db.getPaymentsByUser(filters['userId'], filters['from'], filters['to']);
                res.json(results);
            } catch (error) {
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(403);
        }
    }
});

router.post('/payment', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canPayForOthers)) {
        try {
            let results = await db.addPayment(req.body.uuid, req.body.value);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

// Drinks
router.get('/drink', userMiddleware.isLoggedIn, async (req, res) => {
    try {
        let results = await db.allDrinks();
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }      
});

router.get('/drink/:id', userMiddleware.isLoggedIn, async (req, res) => {
    try {
        let results = await db.getDrink(req.params.id);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }      
});
router.get('/statistics/drink', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canEditDrinks)) {
        try {
            let results = await db.getDrinkStatistics();
            for(result of results){
                result['drink'] = await db.getDrink(result.id);
                result['amountPurchased'] = (await db.getDrinkPurchasedAmount(result.id, result.date)).amountPurchased ?? 0;
                result['amountNew'] = (await db.getDrinkNewAmount(result.id, result.date)).amountNew ?? 0;
            }
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    }      
});

router.post('/drink', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canEditDrinks)) {
        try {
            let results = await db.createDrink(req.body.name, req.body.cost);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

router.put('/drink/:id', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canEditDrinks)) {
        try {
            let results = await db.updateDrink(req.params.id, req.body.name, req.body.cost, req.body.active)
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

router.delete('/drink/:id', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canEditDrinks)) {
        try {
            let results = await db.deleteDrink(req.params.id);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

//New Drinks
router.post('/newDrinks', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canEditDrinks)) {
        try {
            let results = await db.createNewDrinks(req.body.drinkId, req.body.amount, req.userData.userId);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

router.get('/newDrinks', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canSeeAllPurchases)) {
        try {
            let results = [];
            if (req.query.drinkId) {
                results = await db.getNewDrinks(req.query.drinkId, req.query.from, req.query.to);
            } else {
                results = await db.getAllNewDrinks(req.query.from, req.query.to);
            }
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

//Inventory
router.post('/inventory/:id', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canEditDrinks)) {
        try {
            let lastInventory = await db.lastInventory(req.params.id);
            let drinksBooked = await db.allPurchasesForDrinkSinceDate(req.params.id, lastInventory?.date);
            let newDrinks = await db.allNewDrinksSinceDate(req.params.id, lastInventory?.date);
            let amountCalculated = (lastInventory?.amountActual ?? 0) - drinksBooked + newDrinks;
            
            let results = await db.createInventory(req.params.id, req.userData.userId, req.body.amount, amountCalculated);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

router.get('/inventory', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canSeeAllPurchases)) {
        try {
            let results = [];
            if (req.query.drinkId || req.query.drink) {
                results = await db.getInventory(req.query.drinkId || req.query.drink);
            } else {
                results = await db.getAllInventories();
            }
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

//Friends
router.get('/friend', userMiddleware.isLoggedIn, async (req, res) => {
    try {
        let results = await db.getAllFriends(req.userData.userId);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post('/friend', userMiddleware.isLoggedIn, async (req, res) => {
    try {
        if(await db.getFriendshipExists(req.userData.userId, req.body.uuid)) {
            throw Error("Freundschaft existiert bereits");
        }
        if(req.userData.userId == req.body.uuid) {
            throw Error("Such dir Freunde!");
        }
        await db.addFriend(req.userData.userId, req.body.uuid);
        let results = await db.getAllFriends(req.userData.userId);
        res.json(results);
    } catch (error) {
        res.status(500).send({ status: error.status, message: error.message });
    }
});

router.delete('/friend', userMiddleware.isLoggedIn, async (req, res) => {
    try {
        await db.deleteFriend(req.userData.userId, req.body.uuid);
        let results = await db.getAllFriends(req.userData.userId);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;
