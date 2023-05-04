const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const lodash = require('lodash');
//
const { HASH_TIMES } = require('../utils');
const { slug } = require('../utils');
//
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email wrong format!")
      }
    }
  },
  userType: {
    type:String,
    enum: ['ADMIN', 'LANDLORD', 'TENANT'],
    required: true,
  },
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House',
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  token: {
    type: String,
  }
}, {
  timestamps: true,
});
// # Methods
userSchema.statics.findByCredentials = async (userName, password, more) => {
  const user = await User.findOne({ 
    userName,
  });
  if (!user) {
    throw new Error('This user name doesn\'t exist!');
  }
  //
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Wrong password!');
  }
  //
  return user;
}
//
// userSchema.methods.toJSON = function () {
//   const OMIT_FIELDS = ["password"];
//   //
//   const user = this;
//   const userObj = lodash.omit(user, OMIT_FIELDS);
//   //
//   return userObj;
// }
// # Middle-wares
//
userSchema.pre('save', async function (next) {
  const user = this;
  //
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, HASH_TIMES);
  }
  //
  user.slug = slug(user.fullName);
  //
  next();
});
//
const User = mongoose.model('User', userSchema);

module.exports = {
  User
}