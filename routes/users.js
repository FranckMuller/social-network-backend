const express = require('express');
const {
  getUsers,
  getUserProfile,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
} = require('../controllers/users');
const { checkToken } = require('../controllers/auth');
const { setLastActivity } = require('../controllers/profile');

const router = express.Router();

router.get('/users', checkToken, setLastActivity, getUsers);
router.get('/profile/:id', checkToken, setLastActivity, getUserProfile);
router.post(
  '/user/follow/:id',
  checkToken,
  setLastActivity,
  addFollowing,
  addFollower
);
router.delete(
  '/user/unfollow/:id',
  checkToken,
  removeFollowing,
  removeFollower
);

module.exports = router;
