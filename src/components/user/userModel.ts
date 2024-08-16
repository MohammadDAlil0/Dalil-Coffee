import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import {IUser} from './userSchema';
import crypto from 'crypto'

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    confirmPassword: {
        type: String,
        select: false
    },
    photo: String,
    address: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        select: false
    },
    cartID: String,
    phoneNumber: Number,
    passwordChangedAt: {
        type: Date,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = this.cartID = this.phoneNumber = undefined;
});

userSchema.methods.createResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 1000 * 60 * 5;
    return resetToken;
}

export default mongoose.model('User', userSchema);