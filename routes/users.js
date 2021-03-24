const express = require('express')
const User = require('./../models/user')
const {
  getUsers,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
} = require('../controllers/users')
const { checkToken } = require('../controllers/auth')
const { setLastActivity } = require('../controllers/profile')

const router = express.Router()

router.get('/users', checkToken, setLastActivity, getUsers)
router.get('/followings/:id', async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id)
    const followings = await User.find({
      _id: {
        $in: currentUser.followings,
      },
    })
    res.status(200).json(followings)
  } catch (error) {
    console.log(error)
  }
})
router.post('/user/follow/:id', checkToken, setLastActivity, addFollowing, addFollower)
router.delete('/user/unfollow/:id', checkToken, removeFollowing, removeFollower)

module.exports = router
