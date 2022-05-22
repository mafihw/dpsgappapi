const express = require('express');
const db = require('../db');

const router = express.Router();

// Users
router.get('/user/:uuid', async (req, res) => {
    try {
        let results = await db.getUser(req.params.uuid);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }      
});

router.get('/user', async (req, res) => {
    try {
        let results = await db.allUsers();
        res.json(results);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }      
});

router.post('/user', async (req, res) => {
    console.log(req.body);
    try {
        let results = await db.createUser(req.body.name, req.body.nickname, req.body.email);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.delete('/user/:uuid', async (req, res) => {
    try {
        let results = await db.deleteUser(req.params.uuid);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get('/user/:uuid/purchases', async (req, res) => {
    try {
        let results = await db.getUserPurchases(req.params.uuid);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
});


// Items
router.get('/item/:id', async (req, res) => {
    try {
        let results = await db.getUser(req.params.id);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }      
});

router.get('/item', async (req, res) => {
    try {
        let results = await db.allItems();
        res.json(results);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }      
});

router.post('/item', async (req, res) => {
    console.log(req.body);
    try {
        let results = await db.createItem(req.body.name, req.body.price);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.delete('/item/:id', async (req, res) => {
    try {
        let results = await db.deleteItem(req.params.id);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post('/item/enable/:id', async (req, res) => {
    try {
        let results = await db.enableItem(req.params.id);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }     
})

router.post('/item/disable/:id', async (req, res) => {
    try {
        let results = await db.disableItem(req.params.id);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }     
})

// Purchases
router.get('/purchase/:id', async (req, res) => {
    try {
        let results = await db.getPurchase(req.params.id);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get('/purchase', async (req, res) => {
    try {
        let results = await db.allPurchases();
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post('/purchase', async (req, res) => {
    try {
        let results = await db.addPurchase(req.body.userid, req.body.itemid, req.body.quantity, req.body.price);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.delete('/purchase/:id', async (req, res) => {
    try {
        let results = await db.deletePurchase(req.params.id);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
});




module.exports = router;