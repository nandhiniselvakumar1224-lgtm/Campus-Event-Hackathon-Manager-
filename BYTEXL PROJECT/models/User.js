const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
    },
    department: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const bcrypt = require('bcryptjs');
  this.password = await bcrypt.hash(this.password, 10);
});
console.log("USER MODEL LOADED FROM:", __filename);
console.log("password required?", userSchema.path('password').isRequired);
module.exports = mongoose.model('User', userSchema);