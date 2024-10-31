import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    avatar: {
        type: String,
        default: "https://i.redd.it/reddits-default-pfp-looks-like-king-moogle-mogs-minions-v0-bd7f2igjnmmc1.jpg?width=256&format=pjpg&auto=webp&s=3b962b8715fb21db615a347d9f867353f964f2bf",

    },
    bio : {
        
        type: String,
        maxlength : 120,
        

    },
 
},{
    timestamps : true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Compare passwords
userSchema.methods.comparePassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
