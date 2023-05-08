const express = require('express');
const router = express.Router();
const articleController = require('../../controllers/admin/ArticleController');

// Get all articles
router.get('/', articleController.getAllArticles);

// Get article by id
router.get('/:id', articleController.getArticleById);

// Create new article
router.post('/', articleController.createArticle);

// Update article
router.put('/:id', articleController.updateArticle);

// Delete article
router.delete('/:id', articleController.deleteArticle);

module.exports = router;
