const fs = require('fs')
const User = require('./../models/user')

exports.setLastActivity = (req, res, next) => {
  User.findByIdAndUpdate(req.auth.id, { $set: { lastActivity: new Date() } }, (err, success) => {
    next()
  })
}

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    user.populate('followings', '_id name')
    user.populate('followers', '_id name')

    return res.status(200).json(user)
  } catch (error) {
    return res.status(404).json('User not found')
  }
}

exports.updateUserProfile = (req, res) => {
  const entries = Object.keys(req.body.userData)
  const updates = {}
  for (let i = 0; i < entries.length; i++) {
    updates[entries[i]] = Object.values(req.body.userData)[i]
  }
  User.findByIdAndUpdate(req.auth.id, { $set: updates }, (error, success) => {
    if (error) {
      return res.status(403).json({
        errors: ['Не удалось сохранить изменения'],
      })
    }
    return res.status(200).json(updates)
  })
}

let profileMiniaturePhotoName = null
let profileMainPhotoName = null

const uploadProfileMiniature = (base64Miniature, fileName) => {
  const base64Data = base64Miniature.replace(/^data:([A-Za-z-+/]+);base64,/, '')

  profileMiniaturePhotoName = `${Date.now()}-miniature-${fileName}`

  fs.writeFileSync(
    `${__dirname}/../public/uploads/users/photos/${profileMiniaturePhotoName}`,
    base64Data,
    'base64',
    (err) => {},
  )
}

const uploadProfilePhotos = (profileMainPhoto) => {
  profileMainPhotoName = `${Date.now()}${profileMainPhoto.name}`
  profileMainPhoto.mv(
    `${__dirname}/../public/uploads/users/photos/${profileMainPhotoName}`,
    (err) => {},
  )
}

exports.updateProfilePhotos = (req, res) => {
  const base64Miniature = req.body.small
  const profileMainPhoto = req.files.large

  uploadProfilePhotos(profileMainPhoto)
  uploadProfileMiniature(base64Miniature, profileMainPhoto.name)

  const photos = {
    large: `${process.env.BASE_URL_IMG}/${profileMainPhotoName}`,
    small: `${process.env.BASE_URL_IMG}/${profileMiniaturePhotoName}`,
  }
  User.findByIdAndUpdate(req.auth.id, { $set: { photos } }, (err, success) => {
    res.status(200).json(photos)
  })
}
