const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    password: 'root',
    user: 'root',
    database: 'Appdb',
    host: '192.168.178.39',
    port: '3306'
});

let database = {};

// Users
database.allUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Users', (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

database.getUser = (uuid) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Users WHERE uuid = ?', [uuid], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

database.createUser = (name, nickname, email) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Users (uuid, name, nickname, email, balance) VALUES (UUID(), ?, ?, ?, 0)", [name, nickname, email], (err, results) => {
            if(err) {
                console.log(err);
                return reject(err);
            }
            console.log(results);
            pool.query("SELECT * FROM Users WHERE id = ?;",[results.insertId], (err, results) => {
                if(err) {
                    return reject(err);
                }
                console.log(results);
                return resolve(results[0]);
            });
        });
    });
};

database.deleteUser = (uuid) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Users WHERE uuid = ?", [uuid], (selerr, selresults) => {
            if(selerr) {
                return reject(selerr);
            }
            pool.query("DELETE FROM Users WHERE uuid = ?", [uuid], (delerr, delresults) => {
                if(delerr) {
                    return reject(delerr);
                }
                return resolve(selresults);
            });
        });
    });
}

database.getUserPurchases = (uuid) => {
    return new Promise((resolve, reject) => {
        console.log(uuid);
        pool.query("SELECT * FROM Purchases WHERE userid = ?", [uuid], (err, results) => {
            if(err) {
                return reject(err);
            }
            console.log(results);
            return resolve(results);
        });
    });
}

// Items
database.allItems = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Items', (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

database.getItem = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Items WHERE id = ?', [id], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

database.createItem = (name, price) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Items (name, price) VALUES (?, ?)", [name, price], (err, results) => {
            if(err) {
                console.log(err);
                return reject(err);
            }
            console.log(results);
            pool.query("SELECT * FROM Items WHERE id = ?;",[results.insertId], (err, results) => {
                if(err) {
                    return reject(err);
                }
                console.log(results);
                return resolve(results[0]);
            });
        });
    });
};

database.deleteItem = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Items WHERE id = ?", [id], (selerr, selresults) => {
            if(selerr) {
                return reject(selerr);
            }
            pool.query("DELETE FROM Items WHERE id = ?", [id], (delerr, delresults) => {
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
        pool.query("UPDATE Items SET enabled = 0 WHERE id = ?", [id], (upderr, updresults) => {
            if(upderr) {
                return reject(upderr);
            }
            pool.query("SELECT * FROM Items WHERE id = ?", [id], (selerr, selresults) => {
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
        pool.query("UPDATE Items SET enabled = 1 WHERE id = ?", [id], (upderr, updresults) => {
            if(upderr) {
                return reject(upderr);
            }
            pool.query("SELECT * FROM Items WHERE id = ?", [id], (selerr, selresults) => {
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
        pool.query('SELECT * FROM Purchases', (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

database.getPurchase = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Purchases WHERE id = ?', [id], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

database.addPurchase = (userid, itemid, quantity, price) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Purchases (userid, itemid, quantity, price) VALUES (?, ?, ?, ?)", [userid, itemid, quantity, price], (err, results) => {
            if(err) {
                console.log(err);
                return reject(err);
            }
            console.log(results);
            pool.query("SELECT * FROM Purchases WHERE id = ?;",[results.insertId], (err, results) => {
                if(err) {
                    return reject(err);
                }
                console.log(results);
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