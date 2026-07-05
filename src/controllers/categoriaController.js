const Categoria = require('../models/Categoria');

// Criar categoria
exports.createCategoria = async (req, res, next) => {
  try {
    const categoryData = req.body;
    
    if (!categoryData.nome) {
      return res.status(400).json({
        error: 'Campo obrigatório: nome'
      });
    }

    const newCategory = await Categoria.create(categoryData);
    
    res.status(201).json({
      success: true,
      message: 'Categoria criada com sucesso!',
      data: newCategory
    });
  } catch (error) {
    if (error.message.includes('já existe')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
};

// Buscar todas as categorias
exports.getAllCategorias = async (req, res, next) => {
  try {
    const { limit = 100, offset = 0, search } = req.query;
    
    const categories = await Categoria.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      search
    });
    
    const total = await Categoria.count({ search });

    res.status(200).json({
      success: true,
      data: categories,
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

// Buscar categoria por ID
exports.getCategoriaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Categoria.findById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar categoria
exports.updateCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;
    
    const updatedCategory = await Categoria.update(id, categoryData);
    
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Categoria atualizada com sucesso!',
      data: updatedCategory
    });
  } catch (error) {
    if (error.message.includes('já existe')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
};

// Deletar categoria
exports.deleteCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deletedCategory = await Categoria.delete(id);
    
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Categoria deletada com sucesso!',
      data: deletedCategory
    });
  } catch (error) {
    next(error);
  }
};