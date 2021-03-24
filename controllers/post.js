const Post = require('./../models/post')

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ ownerId: req.params.userId })
    res.status(200).json(posts)
  } catch (error) {
    console.log(error)
  }
}

exports.deletePost = async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.postId })
    res.status(200).json({ status: 'ok' })
  } catch (error) {
    console.log(error)
  }
}

exports.addPost = async (req, res) => {
  const postData = {
    text: req.body.text,
    ownerId: req.auth.id,
  }
  const post = await new Post(postData)
  await post.save()
  const newPost = {
    text: post.text,
    _id: post._id,
    created: post.created,
  }
  res.status(200).json(newPost)
}
