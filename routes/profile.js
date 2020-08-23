const express = require('express');
const multer = require('multer');
const { updateUserProfile, updateProfilePhotos, setLastActivity } = require('../controllers/profile');
const { checkToken } = require('../controllers/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

router.put('/profile', checkToken, setLastActivity, updateUserProfile);
router.put('/profilePhotos', checkToken, setLastActivity, upload.single('photo'), updateProfilePhotos);

module.exports = router;
