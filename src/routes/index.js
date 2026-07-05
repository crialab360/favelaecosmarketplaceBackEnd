const express = require('express');
const router = express.Router();
const produtoRoutes = require('./produtoRoutes');
const categoriaRoutes = require('./categoriaRoutes');

// Rotas de produtos
router.use('/produtos', produtoRoutes);

// Rotas de categorias
router.use('/categorias', categoriaRoutes);

// Rota de health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;