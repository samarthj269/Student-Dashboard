// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const UserSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
// });

// // Pre-save middleware to hash password
// UserSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

// const User = mongoose.model('User', UserSchema);
// module.exports = User;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    securityQuestion: {
        type: String,
        required: true,
    },
    securityAnswer: {
        type: String,
        required: true,
    },
});

// Pre-save middleware to hash password and security answer
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    if (this.isModified('securityAnswer')) {
        this.securityAnswer = await bcrypt.hash(this.securityAnswer, 10);
    }
    next();
});

// Method to compare security answer
UserSchema.methods.compareSecurityAnswer = function(answer) {
    return bcrypt.compare(answer, this.securityAnswer);
};

UserSchema.pre('save', async function(next) {
    // Hash the security answer if it's modified
    if (this.isModified('securityAnswer')) {
        const salt = await bcrypt.genSalt(10);
        this.securityAnswer = await bcrypt.hash(this.securityAnswer, salt);
    }
    next();
});
UserSchema.methods.isValidSecurityAnswer = async function(providedAnswer) {
    if (!providedAnswer || !this.securityAnswer) {
        throw new Error('Both data and hash must be provided for comparison');
    }
    return await bcrypt.compare(providedAnswer, this.securityAnswer);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
