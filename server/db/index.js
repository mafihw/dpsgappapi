const mysql = require('mysql');
const pool = require('./connection.js');

let database = {};

// Users
{
    database.allUsers = () => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM users WHERE deleted = FALSE', (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    };

    database.getUser = (id) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0]);
            });
        });
    }

    database.getUserByEmail = (email) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0]);
            });
        });
    }

    database.setRefreshTokenOfUser = (userId, refreshToken) => {
        return new Promise((resolve, reject) => {
            pool.query('Update users SET refreshToken = ?, lastTokenRefresh = now() WHERE id = ?', [refreshToken, userId], (err, results) => {
                if (err) {
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
                if (upderr) {
                    return reject(upderr);
                }
                pool.query("SELECT * FROM users WHERE id = ?", [uuid], (selerr, selresults) => {
                    if (selerr) {
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
                if (delerr) {
                    return reject(delerr);
                }
                pool.query("SELECT * FROM users WHERE id = ?", [id], (selerr, selresults) => {
                    if (selerr) {
                        return reject(selerr);
                    }
                    return resolve(selresults);
                });
            });
        });
    }

    database.getUserPermissions = (userid) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT p.id FROM role_permission rp INNER JOIN permissions p ON p.id = rp.permissionId WHERE rp.roleId = (SELECT roleId FROM users where id = ?) ", [userid], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }
}

// Drinks
{
    database.allDrinks = () => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM drinks WHERE deleted = FALSE', (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }

    database.getDrinkStatistics = () => {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT d.id, iD.date, iD.amountActual '
                + 'FROM drinks d '
                + 'LEFT JOIN inventoryDrink iD '
                + 'ON iD.id = ('
                    + 'SELECT id '
                    + 'FROM inventoryDrink iD '
                    + 'WHERE iD.drinkId = d.id '
                    + 'ORDER by iD.date DESC '
                    + 'LIMIT 1) '
                , (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                });
        });
    }
    
    database.getDrinkPurchasedAmount = (drinkId, date) => {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT sum(amount) as amountPurchased FROM purchases '
                + 'where drinkId = ? '
                + 'AND date >= ? ', [drinkId, date], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results[0]);
                });
        });
    }

    database.getDrinkNewAmount = (drinkId, date) => {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT sum(amount) as amountNew FROM newDrinks '
                + 'where drinkId = ? '
                + 'AND date >= ?', [drinkId, date], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results[0]);
                });
        });
    }

    database.getDrink = (id) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM drinks WHERE id = ?', [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0]);
            });
        });
    }

    database.createDrink = (name, price) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO drinks (name, cost) VALUES (?, ?)", [name, price], (err, results) => {
                if (err) {
                    return reject(err);
                }
                pool.query("SELECT * FROM drinks WHERE id = ?;", [results.insertId], (err, results) => {
                    if (err) {
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
                if (delerr) {
                    return reject(delerr);
                }
                pool.query("SELECT * FROM drinks WHERE id = ?", [id], (selerr, selresults) => {
                    if (selerr) {
                        return reject(selerr);
                    }
                    return resolve(selresults);
                });
            });
        });
    }

    database.updateDrink = (id, name, cost, active) => {

        id = id ?? null;
        name = name ?? null;
        cost = cost ?? null;
        active = active ?? null;

        return new Promise((resolve, reject) => {
            pool.query("UPDATE drinks SET active = IFNULL(?, active), cost = IFNULL(?, cost), name = IFNULL(?, name) WHERE id = ?", [active, cost, name, id], (upderr, updresults) => {
                if (upderr) {
                    return reject(upderr);
                }
                pool.query("SELECT * FROM drinks WHERE id = ?", [id], (selerr, selresults) => {
                    if (selerr) {
                        return reject(selerr);
                    }
                    return resolve(selresults);
                });
            });
        });
    }

}

//New Drinks
{
    database.createNewDrinks = (drinkId, amount, userId) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO newDrinks (drinkId, amount, date, userCreatedId) VALUES (?, ?, now(), ?)", [drinkId, amount, userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                pool.query("SELECT * FROM newDrinks WHERE id = ?;", [results.insertId], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results[0]);
                });
            });
        });
    };

    database.getNewDrinks = (drinkId, from, to) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM newDrinks WHERE drinkId = ? '
            + 'AND UNIX_TIMESTAMP(date) >= IFNULL(?, UNIX_TIMESTAMP(date)) '
            + 'AND UNIX_TIMESTAMP(date) <= IFNULL(?, UNIX_TIMESTAMP(date)) '
            + 'ORDER BY date DESC', [drinkId, from, to], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }

    database.allNewDrinksSinceDate = (drinkId, date) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT *, SUM(amount) as amount FROM newDrinks WHERE drinkId = ? AND date > ?', [drinkId, date], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0].amount ?? 0);
            });
        });
    }

    database.getAllNewDrinks = (from, to) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT nD.*, d.name as drinkName FROM newDrinks nD LEFT JOIN drinks d ON nD.drinkId = d.id '
            + 'WHERE UNIX_TIMESTAMP(nD.date) >= IFNULL(?, UNIX_TIMESTAMP(nD.date)) '
            + 'AND UNIX_TIMESTAMP(nD.date) <= IFNULL(?, UNIX_TIMESTAMP(nD.date)) ' 
            + 'ORDER BY date DESC', [from, to], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }
}

//Inventory
{
    database.createInventory = (drinkId, userId, amountActual, amountCalculated) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO inventoryDrink (drinkId, userCreatedId, amountActual, amountCalculated, date) VALUES (?, ?, ?, ?, now())", [drinkId, userId, amountActual, amountCalculated], (err, results) => {
                if (err) {
                    return reject(err);
                }
                pool.query("SELECT * FROM newDrinks WHERE id = ?;", [results.insertId], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results[0]);
                });
            });
        });
    };

    database.lastInventory = (drinkId) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM inventoryDrink where drinkId = ? ORDER by date DESC LIMIT 1', [drinkId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0]);
            });
        });
    }

    database.getInventory = (drinkId) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM inventoryDrink where drinkId = ? ORDER BY date desc', [drinkId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }

    database.getAllInventories = (drinkId) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT i.*, d.name as drinkName FROM inventoryDrink i LEFT JOIN drinks d ON i.drinkId = d.id ORDER BY date desc', [drinkId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }
}
// Purchases
{
    database.allPurchases = (from, to) => {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT p.*, d.name as drinkName, u.name as userName, uB.name as userBookedName '
                + 'FROM purchases p '
                + 'LEFT JOIN drinks d ON p.drinkId = d.id '
                + 'LEFT JOIN users u ON p.userId = u.id '
                + 'LEFT JOIN users uB ON p.userBookedId = uB.id '
                + 'WHERE UNIX_TIMESTAMP(p.date) >= IFNULL(?, UNIX_TIMESTAMP(p.date)) '
                + 'AND UNIX_TIMESTAMP(p.date) <= IFNULL(?, UNIX_TIMESTAMP(p.date))', [from, to], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }
    
    database.getPurchasesByUser = (userid, from, to) => {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT p.*, d.name as drinkName, u.name as userName, uB.name as userBookedName '
                + 'FROM purchases p '
                + 'LEFT JOIN drinks d ON p.drinkId = d.id '
                + 'LEFT JOIN users u ON p.userId = u.id '
                + 'LEFT JOIN users uB ON p.userBookedId = uB.id '
                + 'WHERE p.userId = ? OR p.userBookedId = ? '
                + 'AND UNIX_TIMESTAMP(p.date) >= IFNULL(?, UNIX_TIMESTAMP(p.date)) '
                + 'AND UNIX_TIMESTAMP(p.date) <= IFNULL(?, UNIX_TIMESTAMP(p.date))', [userid, userid, from, to], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }

    database.allPurchasesForDrinkSinceDate = (drinkId, date) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT SUM(amount) as amount FROM purchases where drinkId = ? AND date > ?', [drinkId, date ?? 0], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0].amount ?? 0);
            });
        });
    }

    database.getPurchase = (id) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM purchases WHERE id = ?', [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0]);
            });
        });
    }

    database.addPurchase = async (userId, userBookedId, drinkId, amount, date) => {
        try {
            var drink = await database.getDrink(drinkId);
            var user = await database.getUser(userId);
            if (user == null || drink == null) {
                throw new Error("User or drink does not exist");
            }
            var balanceAfter = user.balance - (drink.cost * amount);
            await pool.query("UPDATE users SET balance = ? WHERE id = ?", [balanceAfter, userId])
            return new Promise((resolve, reject) => {
                pool.query("INSERT INTO purchases (userId, drinkId, amount, trinkitaetId, inventoryId, cost, balanceAfter, date, userBookedId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [userId, drinkId, amount, null, null, drink.cost, balanceAfter, date, userBookedId], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    pool.query("SELECT * FROM purchases WHERE id = ?;", [results.insertId], (err, results) => {
                        if (err) {
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
                if (selerr) {
                    return reject(selerr);
                }
                pool.query("DELETE FROM purchases WHERE id = ?", [id], (delerr, delresults) => {
                    if (delerr) {
                        return reject(delerr);
                    }
                    return resolve(selresults);
                });
            });
        });
    }
}

// Payments
{
    database.allPayments = (from, to) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT p.*, u.name as userName '
            + 'FROM payments p '
            + 'LEFT JOIN users u ON p.userId = u.id '
            + 'WHERE UNIX_TIMESTAMP(p.date) >= IFNULL(?, UNIX_TIMESTAMP(p.date)) '
            + 'AND UNIX_TIMESTAMP(p.date) <= IFNULL(?, UNIX_TIMESTAMP(p.date))', [from, to], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }

    database.getPaymentsByUser = (userid, from, to) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT p.*, u.name as userName '
            + 'FROM payments p '
            + 'LEFT JOIN users u ON p.userId = u.id '
            + 'WHERE p.userId = ? '
            + 'AND UNIX_TIMESTAMP(p.date) >= IFNULL(?, UNIX_TIMESTAMP(p.date)) '
            + 'AND UNIX_TIMESTAMP(p.date) <= IFNULL(?, UNIX_TIMESTAMP(p.date))', [userid, from, to], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }

    database.getPayment = (id) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM payments WHERE id = ?', [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0]);
            });
        });
    }

    database.addPayment = async (userId, value) => {
        try {
            var user = await database.getUser(userId);
            if (user == null) {
                throw new Error("User does not exist");
            }
            var balanceAfter = user.balance + value;
            await pool.query("UPDATE users SET balance = ? WHERE id = ?", [balanceAfter, userId])
            return new Promise((resolve, reject) => {
                pool.query("INSERT INTO payments (userId, value, balanceAfter) VALUES (?, ?, ?)", [userId, value, balanceAfter], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    pool.query("SELECT * FROM payments WHERE id = ?;", [results.insertId], (err, results) => {
                        if (err) {
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
                if (selerr) {
                    return reject(selerr);
                }
                pool.query("DELETE FROM payments WHERE id = ?", [id], (delerr, delresults) => {
                    if (delerr) {
                        return reject(delerr);
                    }
                    return resolve(selresults);
                });
            });
        });
    }
}

// Friends
{
    database.getAllFriends = (userId) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT u.id as uuid, u.name as userName '
                + 'FROM friends f '
                + 'LEFT JOIN users u ON (f.userId1 = u.id AND ? = userId2) OR (f.userId2 = u.id AND ? = userId1) '
                + 'WHERE UNIX_TIMESTAMP(f.startDate) <= UNIX_TIMESTAMP(now()) '
                +  'AND f.endDate IS NULL',
                [userId, userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }

    database.getFriendshipExists = (userid1, userid2, date) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT count(*) as count '
            + 'FROM friends f '
            + 'WHERE UNIX_TIMESTAMP(f.startDate) <= UNIX_TIMESTAMP(IFNULL(?, now())) '
            +  'AND ((f.endDate IS NULL) OR (UNIX_TIMESTAMP(f.endDate) >= UNIX_TIMESTAMP(IFNULL(?, now())))) '
            +  'AND ((f.userId1 = ? AND f.userId2 = ?) '
                +  'OR (f.userId1 = ? AND f.userId2 = ?))',
             [date, date, userid1, userid2, userid2, userid1], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0].count != 0);
            });
        });
    }

    database.addFriend = async (userId1, userId2) => {
        try {
            var user1 = await database.getUser(userId1);
            if (user1 == null) {
                throw new Error("User does not exist");
            }
            var user2 = await database.getUser(userId2);
            if (user2 == null) {
                throw new Error("User does not exist");
            }
            return new Promise((resolve, reject) => {
                pool.query("INSERT INTO friends (userId1, userId2, startDate) VALUES (?, ?, now())", [userId1, userId2], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    pool.query("SELECT * FROM friends WHERE id = ?;", [results.insertId], (err, results) => {
                        if (err) {
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

    database.deleteFriend = async (userId1, userId2) => {
        try {
            var user1 = await database.getUser(userId1);
            if (user1 == null) {
                throw new Error("User does not exist");
            }
            var user2 = await database.getUser(userId2);
            if (user2 == null) {
                throw new Error("User does not exist");
            }
            return new Promise((resolve, reject) => {
                pool.query('UPDATE friends SET enddate = now() WHERE endDate IS NULL '
                +  'AND ((userId1 = ? AND userId2 = ?)'
                    +  'OR (userId1 = ? AND userId2 = ?))', [userId1, userId2, userId2, userId1], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                });
            });
        } catch (err) {
            throw err;
        }

    }
}


module.exports = database;
