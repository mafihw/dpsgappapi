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
        pool.query('SELECT * FROM users', (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

database.getUser = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
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
        pool.query("SELECT * FROM users WHERE id = ?", [id], (selerr, selresults) => {
            if(selerr) {
                return reject(selerr);
            }
            pool.query("DELETE FROM users WHERE id = ?", [id], (delerr, delresults) => {
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
        pool.query("SELECT * FROM purchases WHERE userid = ?", [userid], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

database.getUserPermissions = (userid) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT p.id FROM role_permission rp INNER JOIN permissions p ON p.id = rp.permissionId WHERE rp.roleId = (SELECT roleId FROM users where userId = ?) ", [userid], (err, results) => {
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
        pool.query('SELECT * FROM drinks', (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

database.getItem = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM drinks WHERE id = ?', [id], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

database.createItem = (name, price) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO drinks (name, cost) VALUES (?, ?)", [name, price], (err, results) => {
            if(err) {
                return reject(err);
            }
            pool.query("SELECT * FROM drinks WHERE id = ?;",[results.insertId], (err, results) => {
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
        pool.query("SELECT * FROM drinks WHERE id = ?", [id], (selerr, selresults) => {
            if(selerr) {
                return reject(selerr);
            }
            pool.query("DELETE FROM drinks WHERE id = ?", [id], (delerr, delresults) => {
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
        pool.query("UPDATE drinks SET active = 0 WHERE id = ?", [id], (upderr, updresults) => {
            if(upderr) {
                return reject(upderr);
            }
            pool.query("SELECT * FROM drinks WHERE id = ?", [id], (selerr, selresults) => {
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
        pool.query("UPDATE drinks SET active = 1 WHERE id = ?", [id], (upderr, updresults) => {
            if(upderr) {
                return reject(upderr);
            }
            pool.query("SELECT * FROM drinks WHERE id = ?", [id], (selerr, selresults) => {
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
        pool.query('SELECT * FROM purchases', (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

database.getPurchase = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM purchases WHERE id = ?', [id], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

database.addPurchase = (userId, drinkId, amount, cost) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO purchases (userId, drinkId, amount, trinkitaetId, inventoryId, cost, balanceAfter) VALUES (?, ?, ?, ?, ?, ?, ?)", [userId, drinkId, amount, trinkitaetId, inventoryId, cost, balanceAfter], (err, results) => {
            if(err) {
                return reject(err);
            }
            pool.query("SELECT * FROM purchases WHERE id = ?;",[results.insertId], (err, results) => {
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
        pool.query("SELECT * FROM purchases WHERE id = ?", [id], (selerr, selresults) => {
            if(selerr) {
                return reject(selerr);
            }
            pool.query("DELETE FROM purchases WHERE id = ?", [id], (delerr, delresults) => {
                if(delerr) {
                    return reject(delerr);
                }
                return resolve(selresults);
            });
        });
    });
}

module.exports = database;