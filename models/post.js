const mongoose = require('mongoose')
const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '貼文名稱必須填寫']
    },
    tags: [
      {
        type: String,
        required: [true, '貼文標籤必須填寫']
      }
    ],
    type: {
      type: String,
      enum:['group','person'],
      required: [true, '貼文類型必須填寫']
    },
    image: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    content: {
      type: String,
      required: [true, '內容必須填寫'],
    },
    likes: {
      type: Number,
      default: 0
    },
    comments:{
      type: Number,
      default: 0
    },
  },
  {
    versionKey: false, // 取消 versionKey
  }
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post