import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return v === null || /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(v);
        },
        message: 'Invalid image URL',
      },
    },
    video: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return v === null || /^https?:\/\/.+\.(mp4|mov|avi)$/.test(v);
        },
        message: 'Invalid video URL',
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    location: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'locationType',
    },
    locationType: {
      type: String,
      required: true,
      enum: ['User', 'Den'],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
