const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const db = require('../db');

module.exports = {
  validateRegister: (req, res, next) => {
    // validate email address
    var pattern=/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!pattern.test(req.body.email)) {
      return res.status(400).send({
        msg: 'Please enter a valid email address'
    });
    }
    // password min 6 chars
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).send({
        msg: 'Please enter a password with min. 6 chars'
      });
    }
    next();
  },

  isLoggedIn: async (req, res, next)  => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        'SECRETKEY'
      );
      if(decoded.timestamp < Date.now()/1000 - 2629746) {
        throw Error("Token Expired");
      }
      const user = await db.getUser(decoded.userId);
      if(user.deleted == true) {
        throw Error("User is deleted");
      }
      req.userData = decoded;
      next();
    } catch (err) {
      return res.status(401).send({
        msg: 'Your session is not valid!'
      });
    }
  },

  hashPassword: async (password) => {
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) reject(err)
        resolve(hash)
      });
    });
    return hashedPassword;
  }
};