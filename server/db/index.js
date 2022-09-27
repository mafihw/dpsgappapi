const mysql = require('mysql');
const pool = require('./connection.js');

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

database.updateUser = (uuid, roleId, email, name, balance, weight, gender, password, deleted) => {

    roleId = roleId ?? null; 
    email = email ?? null;
    name = name ?? null;
    balance = balance ?? null;
    weight = weight ?? null;
    gender = gender ?? null;
    password = password ?? null;
    deleted = deleted ?? null;
   
    return new Promise((resolve, reject) => {
        pool.query("UPDATE users SET roleId = IFNULL(?, roleId), email = IFNULL(?, email), name = IFNULL(?, name), balance = IFNULL(?, balance), weight = IFNULL(?, weight), gender = IFNULL(?, gender), password = IFNULL(?, password), deleted = IFNULL(?, deleted) WHERE id = ?", [roleId, email, name, balance, weight, gender, password, deleted, uuid], (upderr, updresults) => {
            if(upderr) {
                return reject(upderr);
            }
            pool.query("SELECT * FROM users WHERE id = ?", [uuid], (selerr, selresults) => {
                if(selerr) {
                    return reject(selerr);
                }
                return resolve(selresults);
            });
        });
    });
}

database.deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE users SET deleted = TRUE WHERE id = ?", [id], (delerr, delresults) => {
            if(delerr) {
                return reject(delerr);
            }
            pool.query("SELECT * FROM users WHERE id = ?", [id], (selerr, selresults) => {
                if(selerr) {
                    return reject(selerr);
                }
                return resolve(selresults);
            });
        });
    });
}

database.getUserPurchases = (userid) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT p.*, d.name as drinkName, u.name as userName FROM purchases p LEFT JOIN drinks d ON p.drinkId = d.id LEFT JOIN users u ON p.userId = u.id WHERE userid = ?", [userid], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

database.getUserPayments = (userid) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM payments WHERE userId = ?", [userid], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

database.getUserPermissions = (userid) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT p.id FROM role_permission rp INNER JOIN permissions p ON p.id = rp.permissionId WHERE rp.roleId = (SELECT roleId FROM users where id = ?) ", [userid], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

// Drinks
database.allDrinks = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM drinks', (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

database.getDrink = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM drinks WHERE id = ?', [id], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

database.createDrink = (name, price) => {
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

database.deleteDrink = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE drinks SET deleted = TRUE WHERE id = ?", [id], (delerr, delresults) => {
            if(delerr) {
                return reject(delerr);
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

database.updateDrink = (id, name, cost, active) => { 
    return new Promise((resolve, reject) => {
        pool.query("UPDATE drinks SET active = ?, cost = ?, name = ? WHERE id = ?", [active, cost, name, id], (upderr, updresults) => {
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
        pool.query('SELECT p.*, d.name as drinkName, u.name as userName FROM purchases p LEFT JOIN drinks d ON p.drinkId = d.id LEFT JOIN users u ON p.userId = u.id', (err, results) => {
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

database.addPurchase = async (userId, drinkId, amount) => {
    try {
        var drink = await database.getDrink(drinkId);
        var user =  await database.getUser(userId);
        if(user == null || drink == null) {
            throw new Error("User or drink does not exist");
        }
        var balanceAfter = user.balance - (drink.cost * amount);
        await pool.query("UPDATE users SET balance = ? WHERE id = ?", [balanceAfter, userId])
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO purchases (userId, drinkId, amount, trinkitaetId, inventoryId, cost, balanceAfter) VALUES (?, ?, ?, ?, ?, ?, ?)", [userId, drinkId, amount, null, null, drink.cost, balanceAfter], (err, results) => {
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
    } catch (err) {
        throw err;
    }
    
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


// Payments
database.allPayments = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM payments', (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

database.getPayment = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM payments WHERE id = ?', [id], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

database.addPayment = async (userId, value) => {
    try {
        var user =  await database.getUser(userId);
        if(user == null) {
            throw new Error("User does not exist");
        }
        var balanceAfter = user.balance + value;
        await pool.query("UPDATE users SET balance = ? WHERE id = ?", [balanceAfter, userId])
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO payments (userId, value, balanceAfter) VALUES (?, ?, ?)", [userId, value, balanceAfter], (err, results) => {
                if(err) {
                    return reject(err);
                }
                pool.query("SELECT * FROM payments WHERE id = ?;", [results.insertId], (err, results) => {
                    if(err) {
                        return reject(err);
                    }
                    return resolve(results[0]);
                });
            });
        });
    } catch (err) {
        throw err;
    }
    
}

database.deletePayment = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM payments WHERE id = ?", [id], (selerr, selresults) => {
            if(selerr) {
                return reject(selerr);
            }
            pool.query("DELETE FROM payments WHERE id = ?", [id], (delerr, delresults) => {
                if(delerr) {
                    return reject(delerr);
                }
                return resolve(selresults);
            });
        });
    });
}



module.exports = database;
