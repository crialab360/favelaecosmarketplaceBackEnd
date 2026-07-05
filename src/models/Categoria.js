const { getDb } = require('../config/database');

class Categoria {
  // Buscar todas as categorias
  static async findAll(options = {}) {
    const db = getDb();
    const { limit = 100, offset = 0, search } = options;
    
    let query = 'SELECT * FROM categorias';
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push('nome LIKE ?');
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY nome ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const categories = await db.all(query, params);
    return categories;
  }

  // Buscar categoria por ID
  static async findById(id) {
    const db = getDb();
    const category = await db.get(
      'SELECT * FROM categorias WHERE id = ?',
      [id]
    );
    return category;
  }

  // Buscar categoria por nome
  static async findByNome(nome) {
    const db = getDb();
    const category = await db.get(
      'SELECT * FROM categorias WHERE nome = ?',
      [nome]
    );
    return category;
  }

  // Criar nova categoria
  static async create(categoryData) {
    const db = getDb();
    const { nome, icone, descricao, cor } = categoryData;

    // Verificar se já existe
    const existing = await this.findByNome(nome);
    if (existing) {
      throw new Error(`Categoria "${nome}" já existe`);
    }

    const result = await db.run(
      `INSERT INTO categorias (nome, icone, descricao, cor) 
       VALUES (?, ?, ?, ?)`,
      [nome, icone || '📁', descricao || '', cor || '#808080']
    );

    const newCategory = await this.findById(result.lastID);
    return newCategory;
  }

  // Atualizar categoria
  static async update(id, categoryData) {
    const db = getDb();
    const { nome, icone, descricao, cor } = categoryData;

    const existingCategory = await this.findById(id);
    if (!existingCategory) {
      return null;
    }

    // Se mudar o nome, verificar se já existe
    if (nome && nome !== existingCategory.nome) {
      const duplicate = await this.findByNome(nome);
      if (duplicate) {
        throw new Error(`Categoria "${nome}" já existe`);
      }
    }

    await db.run(
      `UPDATE categorias SET
        nome = COALESCE(?, nome),
        icone = COALESCE(?, icone),
        descricao = COALESCE(?, descricao),
        cor = COALESCE(?, cor),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [nome, icone, descricao, cor, id]
    );

    const updatedCategory = await this.findById(id);
    return updatedCategory;
  }

  // Deletar categoria
  static async delete(id) {
    const db = getDb();
    
    const existingCategory = await this.findById(id);
    if (!existingCategory) {
      return null;
    }

    await db.run('DELETE FROM categorias WHERE id = ?', [id]);
    return existingCategory;
  }

  // Contar total de categorias
  static async count(options = {}) {
    const db = getDb();
    const { search } = options;
    
    let query = 'SELECT COUNT(*) as total FROM categorias';
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push('nome LIKE ?');
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await db.get(query, params);
    return result.total;
  }
}

module.exports = Categoria;