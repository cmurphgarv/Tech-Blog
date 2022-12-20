const router = require("express").Router();
const { Blog, User } = require("../../models");
//included comment separately because it wasn't importing properly for some reason
const Comment = require("../../models/Comment");

// route: api/comment

// GET all comments
router.get("/", async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      include: [{ model: Blog }, { model: User }],
    });

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one comment by ID
router.get("/:id", async (req, res) => {
  try {
    const commentData = await Comment.findByPk(req.params.id, {
      include: [{ model: Blog }, { model: User }],
    });

    if (!commentData) {
      res.status(404).json({ message: "No comment found with that id!" });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE a comment

router.post("/", async (req, res) => {
  try {
    const commentData = await Comment.create({
      content: req.body.content,
      user_id: req.body.user_id,
      task_id: req.body.blog_id,
    });
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
