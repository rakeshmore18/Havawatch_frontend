const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    city: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// THIS IS THE CRITICAL LINE THAT WAS MISSING OR TYPO'D:
module.exports = mongoose.model('User', UserSchema);