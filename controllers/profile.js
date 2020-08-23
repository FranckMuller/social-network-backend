const User = require('./../models/user');

exports.setLastActivity = (req, res, next) => {
  User.findByIdAndUpdate(req.auth.id, { $set: { lastActivity: new Date() } }, (err, success) => {
    next();
  });
};

exports.updateUserProfile = (req, res) => {
  const entries = Object.keys(req.body.userData);
  const updates = {};
  for (let i = 0; i < entries.length; i++) {
    updates[entries[i]] = Object.values(req.body.userData)[i];
  }
  User.findByIdAndUpdate(req.auth.id, { $set: updates }, (error, success) => {
    if (error) {
      return res.status(403).json({
        errors: ['Не удалось сохранить изменения'],
      });
    }
    return res.status(200).json(updates);
  });
};

exports.updateProfilePhotos = (req, res) => {
  const mainPhoto = `${process.env.BASE_URL_IMG}/${req.body.profilePhotos.large.path}`;
  const photos = {
    large: mainPhoto,
    small: req.body.profilePhotos.small,
  };
  User.findByIdAndUpdate(req.auth.id, { $set: { photos } }, (err, success) => {
    console.log(success);
    res.status(200).json(photos);
  });
};
