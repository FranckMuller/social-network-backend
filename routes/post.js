const express = require('express')
const { setLastActivity } = require('../controllers/profile')
const { addPost, getPosts, deletePost } = require('../controllers/post')
const { checkToken } = require('../controllers/auth')

const router = express.Router()

router.get('/posts/:userId', checkToken, getPosts)
router.post('/post', checkToken, setLastActivity, addPost)
router.delete('/post/:postId', checkToken, setLastActivity, deletePost)

module.exports = router
