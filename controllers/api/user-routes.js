const router = require('express').Router();
const User = require('../models/User');
const Blog = require('../models/Blog');

// GET all users
router.get('/', async (req, res) => {
    try {
      const userData = await User.findAll({
        include: [{ model: Blog }],
      });
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// GET one user by ID
router.get('/:id', async (req, res) => {
    try {
      const userData = await User.findByPk(req.params.id, {
        include: [{ model: Blog }],
      });
  
      if (!userData) {
        res.status(404).json({ message: 'No user found with that id!' });
        return;
      }
  
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // CREATE a user
router.post('/', async (req, res) => {
    try {
      const userData = await User.create(req.body);
      res.status(200).json(userData);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  
  
  module.exports = router;