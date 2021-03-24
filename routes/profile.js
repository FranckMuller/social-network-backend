const express = require('express')
const {
  updateUserProfile,
  updateProfilePhotos,
  setLastActivity,
  getUserProfile,
} = require('../controllers/profile')
const { checkToken } = require('../controllers/auth')

const router = express.Router()

router.get('/profile/:id', checkToken, setLastActivity, getUserProfile)
router.put('/profile', checkToken, setLastActivity, updateUserProfile)
router.put('/profilePhotos', checkToken, setLastActivity, updateProfilePhotos)

module.exports = router
