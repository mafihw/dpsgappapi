const express = require('express');

const router = express.Router();

const logindb = require('../db/logindb');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const userMiddleware = require('../middleware/user.js');

// Authentication
router.post('/register', userMiddleware.validateRegister, (req, res, next) => {
    logindb.query(
      `SELECT * FROM Users WHERE LOWER(email) = LOWER(${logindb.escape(
        req.body.email
      )});`,
      (err, result) => {
        if (result.length) {
          return res.status(409).send({
            msg: 'This email is already in use!'
          });
        } else {
          // username is available
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                msg: err
              });
            } else {
              // has hashed pw => add to database
              logindb.query(
                `INSERT INTO Users (id, email, password, registered, name, nickname, balance) VALUES ('${uuid.v4()}', ${logindb.escape(req.body.email)}, ${logindb.escape(hash)}, now(), ${logindb.escape(req.body.name)}, ${logindb.escape(req.body.nickname)}, 0);`,
                (err, result) => {
                  if (err) {
                    //throw err;
                    return res.status(400).send({
                      msg: err
                    });
                  }
                  return res.status(201).send({
                    msg: 'Registered!'
                  });
                }
              );
            }
          });
        }
      }
    );
});

router.post('/login', (req, res, next) => {
    logindb.query(
        'SELECT * FROM Users WHERE email = ?;',[req.body.email],
        (err, result) => {
        // user does not exists
        if (err) {
            //throw err;
            return res.status(400).send({
            msg: err
            });
        }
        if (!result.length) {
            return res.status(401).send({
            msg: 'Email or password is incorrect!'
            });
        }
        // check password
        bcrypt.compare(
            req.body.password,
            result[0]['password'],
            (bErr, bResult) => {
            // wrong password
            if (bErr) {
                //throw bErr;
                return res.status(401).send({
                msg: 'Email or password is incorrect!'
                });
            }
            if (bResult) {
                const token = jwt.sign({
                    username: result[0].email,
                    userId: result[0].id
                },
                'SECRETKEY', {
                    expiresIn: '7d'
                }
                );
                logindb.query(
                `UPDATE Users SET last_login = now() WHERE id = '${result[0].id}'`
                );
                return res.status(200).send({
                msg: 'Logged in!',
                token,
                user: result[0]
                });
            }
            return res.status(401).send({
                msg: 'Username or password is incorrect!'
            });
            }
        );
        }
    );
});

module.exports = router;