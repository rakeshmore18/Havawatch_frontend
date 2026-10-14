const mongoose = require('mongoose');

const historyEntrySchema = new mongoose.Schema({
    cause: {
        type: String,
        trim: true
    },
    aqi: {
        type: Number,
        min: [0, 'AQI cannot be negative']
    },
    city: {
        type: String,
        trim: true
    },
    date: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Full name must be at least 2 characters long'],
        maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        minlength: [2, 'City name must be at least 2 characters long'],
        maxlength: [100, 'City name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
            'Please provide a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
            validator: function (value) {
                // Requires: min 8 chars, 1 uppercase, 1 digit, 1 special character
                return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#\-]).{8,}$/.test(value);
            },
            message: 'Password must be at least 8 characters and include at least 1 uppercase letter, 1 number, and 1 special character (@$!%*?&_#-).'
        }
    },
    createdAt: { type: Date, default: Date.now },
    history: [historyEntrySchema]
});

module.exports = mongoose.model('User', UserSchema);