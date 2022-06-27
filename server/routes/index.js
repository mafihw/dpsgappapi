const express = require('express');

const router = express.Router();

const db = require('../db');
const userMiddleware = require('../middleware/user.js');
const permissions = require('../middleware/permissions.js');

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

router.put('/user/:uuid', userMiddleware.isLoggedIn, async (req, res) => {
    let oldUserdata = await db.getUser(req.params.uuid);
    if(oldUserdata != null) {
        if(await permissions.hasPermission(req.userData.userId, permissions.perms.canEditOtherUsers)) {
            try {
                let results = await db.updateUser(req.params.uuid, req.params.roleId, req.params.email, req.params.name, req.params.balance, req.params.weight, req.params.gender);
                res.json(results);
            } catch (error) {
                res.sendStatus(500);
            }
        } else if(req.userData.userId == req.params.uuid) {
            if(req.params.roleId != oldUserdata.roleId || req.params.balance != oldUserdata.balance) {
                res.sendStatus(403);
            } else {
                try {
                    let results = await db.updateUser(req.params.uuid, req.params.roleId, req.params.email, req.params.name, req.params.balance, req.params.weight, req.params.gender);
                    res.json(results);
                } catch (error) {
                    res.sendStatus(500);
                }
            }
        }else {
            req.sendStatus(403);
        }
    } else {
        req.sendStatus(404);
    }
});

router.delete('/user/:uuid', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canEditOtherUsers)) {
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

// Purchases
router.get('/user/:uuid/purchase', userMiddleware.isLoggedIn, async (req, res) => {
    if(req.userData.userId == req.params.uuid || await permissions.hasPermission(req.userData.userId, permissions.perms.canSeeAllPurchases)) {
        try {
            let results = await db.getUserPurchases(req.params.uuid);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

router.get('/user/purchase/:id', userMiddleware.isLoggedIn, async (req, res) => {
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

router.get('/user/purchase', userMiddleware.isLoggedIn, async (req, res) => {
    if(await permissions.hasPermission(req.userData.userId, permissions.perms.canSeeAllPurchases)) {
        try {
            let results = await db.allPurchases();
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

router.post('/user/:uuid/purchase', userMiddleware.isLoggedIn, async (req, res) => {
    if(req.userData.userId == req.params.uuid || await permissions.hasPermission(req.userData.userId, permissions.perms.canPurchaseForOthers)) {
        try {
            let results = await db.addPurchase(req.params.uuid, req.body.itemid, req.body.quantity, req.body.price);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});



// Items
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

module.exports = router;