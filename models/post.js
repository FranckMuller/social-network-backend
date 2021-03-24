const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const postSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },

  ownerId: {
    type: String,
    required: true,
  },

  created: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Post', postSchema)
