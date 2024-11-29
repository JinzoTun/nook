import mongoose from 'mongoose';

const DenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 30, // Limit the name length
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300, // Limit the description length
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    memberCount: {
      type: Number,
      default: 0,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'restricted'],
      default: 'public',
    },
    rules: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    categories: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    banner: {
      type: String,
      default : "https://res.cloudinary.com/du9fhtw2x/image/upload/v1732911875/nook/uploads/ypuooz8w13zq1sssb5ki.png",

    },
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/du9fhtw2x/image/upload/v1732911989/nook/uploads/h03qoi1dcdktiuxfxu5u.jpg",
    },
    flair: [
      {
        text: String,
        color: String,
        
      },
    ],
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    
  },

  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Den = mongoose.model('Den', DenSchema);

export default Den;
