const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: true,
    },
    npsn: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
<<<<<<< HEAD
    npsn: {
      type: String,
      required: true,
      unique: true,
    },
=======
>>>>>>> 77e6c2b176af517e26347389d6172186670b99c9
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
