const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    password: 'root',
    user: 'root',
    database: 'dpsgapp',
    host: 'localhost',
    port: '3306'
});

let database = {};

// Users
database.allUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM user', (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

database.getUser = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM user WHERE id = ?', [id], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

/* Handeled by auth.js
database.createUser = (name, nickname, email) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Users (uuid, name, nickname, email, balance) VALUES (UUID(), ?, ?, ?, 0)", [name, nickname, email], (err, results) => {
            if(err) {
                return reject(err);
            }
            pool.query("SELECT * FROM Users WHERE id = ?;",[results.insertId], (err, results) => {
                if(err) {
                    return reject(err);
                }
                return resolve(results[0]);
            });
        });
    });
};*/

database.deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM user WHERE id = ?", [id], (selerr, selresults) => {
            if(selerr) {
                return reject(selerr);
            }
            pool.query("DELETE FROM Users WHERE id = ?", [id], (delerr, delresults) => {
                if(delerr) {
                    return reject(delerr);
                }
                return resolve(selresults);
            });
        });
    });
}

database.getUserPurchases = (userid) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM purchase WHERE userid = ?", [userid], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

// Items
database.allItems = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM drink', (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

database.getItem = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM drink WHERE id = ?', [id], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

database.createItem = (name, price) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO drink (name, cost) VALUES (?, ?)", [name, price], (err, results) => {
            if(err) {
                return reject(err);
            }
            pool.query("SELECT * FROM drink WHERE id = ?;",[results.insertId], (err, results) => {
                if(err) {
                    return reject(err);
                }
                return resolve(results[0]);
            });
        });
    });
};

database.deleteItem = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM drink WHERE id = ?", [id], (selerr, selresults) => {
            if(selerr) {
                return reject(selerr);
            }
            pool.query("DELETE FROM drink WHERE id = ?", [id], (delerr, delresults) => {
                if(delerr) {
                    return reject(delerr);
                }
                return resolve(selresults);
            });
        });
    });
}

database.disableItem = (id) => { 
    return new Promise((resolve, reject) => {
        pool.query("UPDATE drink SET active = 0 WHERE id = ?", [id], (upderr, updresults) => {
            if(upderr) {
                return reject(upderr);
            }
            pool.query("SELECT * FROM drink WHERE id = ?", [id], (selerr, selresults) => {
                if(selerr) {
                    return reject(selerr);
                }
                return resolve(selresults);
            });
        });
    });
}

database.enableItem = (id) => { 
    return new Promise((resolve, reject) => {
        pool.query("UPDATE drink SET active = 1 WHERE id = ?", [id], (upderr, updresults) => {
            if(upderr) {
                return reject(upderr);
            }
            pool.query("SELECT * FROM drink WHERE id = ?", [id], (selerr, selresults) => {
                if(selerr) {
                    return reject(selerr);
                }
                return resolve(selresults);
            });
        });
    });
}

// Purchases
database.allPurchases = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM purchase', (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

database.getPurchase = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM purchase WHERE id = ?', [id], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

database.addPurchase = (userid, itemid, quantity, price) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO purchase (userId, drinkId, amount, trinkitaetId, inventoryId, cost, balanceAfter) VALUES (?, ?, ?, ?, ?, ?, ?)", [userId, drinkId, amount, trinkitaetId, inventoryId, cost, balanceAfter], (err, results) => {
            if(err) {
                return reject(err);
            }
            pool.query("SELECT * FROM Purchases WHERE id = ?;",[results.insertId], (err, results) => {
                if(err) {
                    return reject(err);
                }
                return resolve(results[0]);
            });
        });
    });
}

database.deletePurchase = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Purchases WHERE id = ?", [id], (selerr, selresults) => {
            if(selerr) {
                return reject(selerr);
            }
            pool.query("DELETE FROM Purchases WHERE id = ?", [id], (delerr, delresults) => {
                if(delerr) {
                    return reject(delerr);
                }
                return resolve(selresults);
            });
        });
    });
}

module.exports = database;