const router = require("express").Router();
const { Blog, User } = require("../models");
//included comment separately because it wasn't importing properly for some reason
const Comment = require("../models/Comment");
const moment = require("moment");

// GET all blog posts for homepage
router.get("/", async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    try {
      const dbBlogData = await Blog.findAll({
        include: { model: User },
      });

      //format the date for blog post so it is more readable
      let blogPosts = dbBlogData.map((blogPost) => blogPost.get({ plain: true }));
      blogPosts = blogPosts.map((blogPost) => {
        blogPost.createdAt = moment(blogPost.createdAt).format("MMM Do YY");
        return blogPost;
      });
      res.render("homepage", {
        tasks,
        loggedIn: req.session.loggedIn,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

// GET one blog post
router.get("/blog/:id", async (req, res) => {
  // If the user is not logged in, redirect the user to the login page
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    // If the user is logged in, allow them to view the gallery
    try {
      const dbBlogData = await Blog.findByPk(req.params.id, {
        include: [
          {
            model: Blog,
            attributes: ["id", "title", "createdAt", "post_content", "user_id"],
          },
        ],
      });
      const blogPost = dbBlogData.get({ plain: true });
      res.render("blogPost", { blogPost, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

// Get all comments with associated blog post

router.get("/comment/:id", async (req, res) => {
  // If the user is not logged in, redirect the user to the login page
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    // If the user is logged in, allow them to view the comment
    try {
      const dbCommentData = await Comment.findByPk(req.params.id);
      const comment = dbCommentData.get({ plain: true });

      const dbAllCommentsData = await Comment.findAll({
        where: {
          blog_id: comment.blog_id,
        },
        include: [{ model: User }],
      });

      const comments = dbAllCommentsData.map((comment) =>
        comment.get({ plain: true })
      );

      res.render("comment", {
        comments,
        loggedIn: req.session.loggedIn,
        user_id: req.session.user_id,
        blog_id: comment.task_id,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.render("login");
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
