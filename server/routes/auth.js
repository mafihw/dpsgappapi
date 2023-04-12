const express = require('express');

const router = express.Router();

const db = require('../db');
const logindb = require('../db/connection');
const config = require('../config.js')
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const userMiddleware = require('../middleware/user.js');

// Authentication
router.post('/register', userMiddleware.validateRegister, (req, res, next) => {
    logindb.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER(${logindb.escape(
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
                `INSERT INTO users (id, email, password, registered, name) VALUES ('${uuid.v4()}', ${logindb.escape(req.body.email)}, ${logindb.escape(hash)}, now(), ${logindb.escape(req.body.name)});`,
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
      'SELECT * FROM users WHERE email = ?;',[req.body.email],
      (err, result) => {
      // user does not exist
      if (err) {
          //throw err;
          return res.status(400).send({
          msg: err
          });
      }
      if (!result.length || result[0].deleted) {
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
                  userEmail: result[0].email,
                  userId: result[0].id,
                  timestamp: Date.now()/1000
                },
                config.secretKey, {
                    expiresIn: config.tokenExpiration
                }
              );
              const refreshToken = jwt.sign({
                  email: result[0].email,
                },
                config.secretRefreshKey, { expiresIn: config.refreshTokenExpiration }
              );
              // Assigning refresh token in http-only cookie 
              res.cookie('jwt', refreshToken, { httpOnly: true, secure: true }
              );              
              db.setRefreshTokenOfUser(result[0].id, refreshToken);
              logindb.query(`UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`);
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

router.post('/refresh', (req, res) => {
  logindb.query(
    'SELECT * FROM users WHERE email = ?;',[req.body.email],
    (err, result) => {
      // user does not exist
      if (err) {
          //throw err;
          return res.status(400).send({
          msg: err
          });
      }
      if (!result.length || result[0].deleted) {
          return res.status(401).send({
          msg: 'Email is incorrect or user is deleted!'
          });
      }
      if (req.cookies?.jwt) {

          // Destructuring refreshToken from cookie
          const refreshToken = req.cookies.jwt;

          //check if refreshToken is the newest one. If not, the refresh token has been compromised presumably
          if(result[0].refreshToken != refreshToken){            
            db.setRefreshTokenOfUser(result[0].id, null);
            return res.status(409).json({ message: 'Refreshtoken already used!' });
          }

          // Verifying refresh token
          jwt.verify(refreshToken, config.secretRefreshKey, 
          (err, decoded) => {
              if (err) {
                  // Wrong Refesh Token
                  return res.status(406).json({ message: 'Unauthorized' });
              }
              else {
                  // Correct token we send a new access token
                  const token = jwt.sign({
                      userEmail: result[0].email,
                      userId: result[0].id,
                      timestamp: Date.now()/1000
                    },
                    config.secretKey, {
                        expiresIn: config.tokenExpiration
                    }
                  );
                const refreshToken = jwt.sign({
                    email: result[0].email,
                  },
                  config.secretRefreshKey, { expiresIn: config.refreshTokenExpiration }
                );
                // Assigning refresh token in http-only cookie 
                res.cookie('jwt', refreshToken, { httpOnly: true, secure: true }
                );
                db.setRefreshTokenOfUser(result[0].id, refreshToken);
                return res.json({ token });
              }
          })
      } else {
          return res.status(406).json({ message: 'Unauthorized' });
      }
    }
  );
});

module.exports = router;