const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Rotas CRUD
router.get('/', produtoController.getAllProdutos);
router.get('/with-images', produtoController.getProdutosWithImages);
router.get('/:id', produtoController.getProdutoById);
router.post('/', produtoController.createProduto);
router.put('/:id', produtoController.updateProduto);
router.patch('/:id', produtoController.partialUpdateProduto);
router.delete('/:id', produtoController.deleteProduto);

// Rotas de filtro
router.get('/categoria/:categoria', produtoController.getProdutosByCategoria);
router.get('/loja/:loja', produtoController.getProdutosByLoja);
router.get('/link/:link', produtoController.getProdutosByLink);

module.exports = router;