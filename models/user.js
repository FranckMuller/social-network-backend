const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
const crypto = require('crypto');
const mongoosePaginate = require('mongoose-paginate-v2');
const dotenv = require('dotenv');

dotenv.config();

mongoose.set('useFindAndModify', false);

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  surname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
  },

  hashed_password: {
    type: String,
    required: true,
  },

  salt: String,

  photos: {
    large: {
      type: String,
      default: '',
    },
    small: {
      type: String,
      default: '',
    },
  },

  location: {
    country: String,
    city: String,
  },

  following: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  followers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],

  lastActivity: {
    type: Date,
    required: true,
    default: new Date(),
  },

  status: String,
  birthDate: String,

  created: {
    type: Date,
    default: Date.now,
  },
});

userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(() => {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (authPass) {
    return this.encryptPassword(authPass) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    } catch (err) {
      return '';
    }
  },

  toJSON: function () {
    var obj = this.toObject();
    delete obj.salt;
    delete obj.hashed_password;
    return obj;
  },
};

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);
