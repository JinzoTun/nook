import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    vote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote',
    },
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', NotificationSchema);