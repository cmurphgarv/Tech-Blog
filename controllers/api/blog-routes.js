const router = require('express').Router();
const { request } = require('express');
const User = require('../../models/User');
const Blog = require('../../models/Blog');

// The api/blogs endpoint

// GET all blogs
router.get("/", async (req, res) => {
  try {
    const userData = await Blog.findAll({
      include: [{ model: User }, { model: Comment }],
    });
    res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

  // GET one blog by ID
  router.get("/:id", async (req, res) => {
    try {
      const userData = await Blog.findByPk(req.params.id, {
        include: [{ model: User }, { model: Comment }],
      });
  
      if (!userData) {
        res.status(404).json({ message: "No user found with that id!" });
        return;
      }
  
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // CREATE new blog
router.post("/", async (req, res) => {
  try {
    const dbBlogData = await Blog.create({
      title: req.body.title,
      createdAt: req.body.description,
      post_content: req.body.deadline,
      user_id: req.body.user_id,
    });
    res.status(200).json(dbBlogData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
