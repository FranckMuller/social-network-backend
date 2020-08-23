const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const dotenv = require('dotenv');
const formidable = require('formidable');
const fs = require('fs');

dotenv.config();

exports.signup = async (req, res) => {
  const userExists = await User.findOne({
    email: req.body.email,
  });

  if (userExists) {
    return res.status(403).json({
      errors: ['такой email уже используется'],
    });
  }

  const user = await new User(req.body);

  await user.save();

  const accessToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET
  );

  res.cookie('t', accessToken, {
    expire: new Date() + 10000000,
  });

  const authData = {
    accessToken: accessToken,
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    miniature: '',
  };

  res.status(200).json(authData);
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }, (err, user) => {
    if (err || !user || !user.authenticate(password)) {
      return res.status(404).json({
        errors: ['неверный email или пароль'],
      });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET
    );

    res.cookie('t', accessToken, {
      expire: new Date() + 10000000,
    });

    const authData = {
      accessToken: accessToken,
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
    };

    return res.status(200).json(authData);
  });
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  return res.status(200).json({
    message: 'Sign out success',
  });
};

exports.checkToken = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth',
});
