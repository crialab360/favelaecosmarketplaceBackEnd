const express = require('express');
const router = express.Router();
const produtoRoutes = require('./produtoRoutes');

// Rotas de produtos
router.use('/produtos', produtoRoutes);

// Rota de health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;