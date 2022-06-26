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
    if(permissions.hasPermission(permissions.perms.canGetAllUsers)) {
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
    if(permissions.hasPermission(permissions.perms.canGetAllUsers)) {
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

router.post('/user', userMiddleware.isLoggedIn, async (req, res) => {
    if(permissions.hasPermission(permissions.perms.canRegisterUsers)) {
        try {
            let results = await db.createUser(req.body.name, req.body.nickname, req.body.email);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

router.delete('/user/:uuid', userMiddleware.isLoggedIn, async (req, res) => {
    if(permissions.hasPermission(permissions.perms.canEditOtherUsers)) {
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

router.get('/user/:uuid/purchases', userMiddleware.isLoggedIn, async (req, res) => {
    if(permissions.hasPermission(permissions.perms.canSeeAllPurchases)) {
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


// Items
router.get('/item/:id', userMiddleware.isLoggedIn, async (req, res) => {
    try {
        let results = await db.getUser(req.params.id);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }      
});

router.get('/item', userMiddleware.isLoggedIn, async (req, res) => {
    try {
        let results = await db.allItems();
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }      
});

router.post('/item', userMiddleware.isLoggedIn, async (req, res) => {
    if(permissions.hasPermission(permissions.perms.canEditDrinks)) {
        try {
            let results = await db.createItem(req.body.name, req.body.price);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

router.delete('/item/:id', userMiddleware.isLoggedIn, async (req, res) => {
    if(permissions.hasPermission(permissions.perms.canEditDrinks)) {
        try {
            let results = await db.deleteItem(req.params.id);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

router.post('/item/enable/:id', userMiddleware.isLoggedIn, async (req, res) => {
    if(permissions.hasPermission(permissions.perms.canEditDrinks)) {
        try {
            let results = await db.enableItem(req.params.id);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
})

router.post('/item/disable/:id', userMiddleware.isLoggedIn, async (req, res) => {
    if(permissions.hasPermission(permissions.perms.canEditDrinks)) {
        try {
            let results = await db.disableItem(req.params.id);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }   
})

// Purchases
router.get('/purchase/:id', userMiddleware.isLoggedIn, async (req, res) => {
    if(permissions.hasPermission(permissions.perms.canSeeAllPurchases)) {
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
    if(permissions.hasPermission(permissions.perms.canSeeAllPurchases)) {
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

router.post('/purchase', userMiddleware.isLoggedIn, async (req, res) => {
    if(permissions.hasPermission(permissions.perms.canPurchaseForOthers)) {
        try {
            let results = await db.addPurchase(req.body.userid, req.body.itemid, req.body.quantity, req.body.price);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});

router.delete('/purchase/:id', userMiddleware.isLoggedIn, async (req, res) => {
    if(permissions.hasPermission(permissions.perms.canEditPurchases)) {
        try {
            let results = await db.deletePurchase(req.params.id);
            res.json(results);
        } catch (error) {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(403);
    }
});




module.exports = router;