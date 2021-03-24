const User = require('./../models/user');

exports.getUsers = (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;

  const options = {
    page,
    limit,
    select: '_id name surname photos status location',
  };

  User.paginate({ $and: [{ _id: { $ne: req.auth.id } }] }, options)
    .then((users) => {
      User.findById(req.auth.id).then((authedUser) => {
        const newUsers = users.docs.map((user) => {
          if (authedUser.followings.findIndex((follow) => user._id.equals(follow)) !== -1) {
            return {
              ...user._doc,
              isFollowed: true,
            };
          } else {
            return {
              ...user._doc,
              isFollowed: false,
            };
          }
        });
        return res.json({
          users: newUsers,
          usersCount: users.totalDocs,
        });
      });
    })
    .catch((err) => {
      return res.json({
        error: err,
      });
    });
};

exports.addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.auth.id,
    {
      $push: { followings: req.params.id },
    },
    (err, result) => {
      if (err) {
        return res.status(400).json(err);
      }
      next();
    }
  );
};

exports.addFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      $push: { followers: req.auth.id },
    },
    { new: true }
  )
    .populate('followings', '_id name surname')
    .populate('followers', '_id name surname')
    .exec((err, user) => {
      if (err) {
        return res.status(400);
      } else {
        return res.status(200).json(user);
      }
    });
};

// remove follow unfollow
exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(req.auth.id, { $pull: { followings: req.params.id } }, (err, result) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    next();
  });
};

exports.removeFollower = (req, res) => {
  User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.auth.id } }, { new: true })
    .populate('followings', '_id name')
    .populate('followers', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.status(200).json(result);
    });
};
