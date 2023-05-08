// articleController.js
const { Article } = require('../../models');

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll();
    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, body } = req.body;
    const article = await Article.create({ title, body });
    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { title, body } = req.body;
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    article.title = title;
    article.body = body;
    await article.save();
    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    await article.destroy();
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
