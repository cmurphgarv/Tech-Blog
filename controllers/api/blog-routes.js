const router = require('express').Router();
const { request } = require('express');
const User = require('../../models/User');
const Blog = require('../../models/Blog');

// The api/blogs endpoint

// GET all blogs
router.get('/', async (req, res) => {
    try {
      const blogData = await Blog.findAll({
        include: [{ model: User }],
      });
      res.status(200).json(blogData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // GET one blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [{ model: User }],
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog found with that id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});