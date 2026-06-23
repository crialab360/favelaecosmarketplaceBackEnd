const Produto = require('../models/Produto');

exports.createProduto = async (req, res, next) => {
  try {
    const productData = req.body;
    
    if (!productData.loja || !productData.categoria || !productData.nome) {
      return res.status(400).json({
        error: 'Campos obrigatórios: loja, categoria, nome'
      });
    }

    const newProduct = await Produto.create(productData);
    
    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso!',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllProdutos = async (req, res, next) => {
  try {
    const { limit = 100, offset = 0, categoria, search } = req.query;
    
    const products = await Produto.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      categoria,
      search
    });
    
    const total = await Produto.count({ categoria, search });

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProdutoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Produto.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    
    const updatedProduct = await Produto.update(id, productData);
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Produto atualizado com sucesso!',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

exports.partialUpdateProduto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    
    const updatedProduct = await Produto.update(id, productData);
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Produto atualizado parcialmente com sucesso!',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduto = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deletedProduct = await Produto.delete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Produto deletado com sucesso!',
      data: deletedProduct
    });
  } catch (error) {
    next(error);
  }
};

exports.getProdutosByCategoria = async (req, res, next) => {
  try {
    const { categoria } = req.params;
    const products = await Produto.findByCategoria(categoria);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

exports.getProdutosByLoja = async (req, res, next) => {
  try {
    const { loja } = req.params;
    const products = await Produto.findByLoja(loja);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

exports.getProdutosByLink = async (req, res, next) => {
  try {
    const { link } = req.params;
    const products = await Produto.findByLink(link);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

exports.getProdutosWithImages = async (req, res, next) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const products = await Produto.findWithImages({
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};