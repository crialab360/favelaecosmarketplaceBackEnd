const { getDb } = require('../config/database');

class Produto {
  static async findAll(options = {}) {
    const db = getDb();
    const { limit = 100, offset = 0, categoria, search } = options;
    
    let query = 'SELECT * FROM produtos';
    let params = [];
    let conditions = [];

    if (categoria) {
      conditions.push('categoria LIKE ?');
      params.push(`%${categoria}%`);
    }

    if (search) {
      conditions.push('(nome LIKE ? OR loja LIKE ? OR vendedor LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const products = await db.all(query, params);
    return products;
  }

  static async findById(id) {
    const db = getDb();
    const product = await db.get(
      'SELECT * FROM produtos WHERE id = ?',
      [id]
    );
    return product;
  }

  static async create(productData) {
    const db = getDb();
    const {
      icone, tipodeproduto, classedoproduto = 'badge-new', loja, categoria,
      nome, valorsugerido, frete, link, vendedor, image_url, descricao
    } = productData;

    const result = await db.run(
      `INSERT INTO produtos (
        icone, tipodeproduto, classedoproduto, loja, categoria, nome,
        valorsugerido, frete, link, vendedor, image_url, descricao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        icone || '🛍️', 
        tipodeproduto || 'NOVO', 
        classedoproduto, 
        loja, 
        categoria, 
        nome,
        valorsugerido || '', 
        frete || '',
        link || '', 
        vendedor || '', 
        image_url || 'https://via.placeholder.com/300x300', 
        descricao || ''
      ]
    );

    const newProduct = await this.findById(result.lastID);
    return newProduct;
  }

  static async update(id, productData) {
    const db = getDb();
    const {
      icone, tipodeproduto, classedoproduto, loja, categoria,
      nome, valorsugerido, frete, link, vendedor, image_url, descricao
    } = productData;

    const existingProduct = await this.findById(id);
    if (!existingProduct) {
      return null;
    }

    await db.run(
      `UPDATE produtos SET
        icone = COALESCE(?, icone),
        tipodeproduto = COALESCE(?, tipodeproduto),
        classedoproduto = COALESCE(?, classedoproduto),
        loja = COALESCE(?, loja),
        categoria = COALESCE(?, categoria),
        nome = COALESCE(?, nome),
        valorsugerido = COALESCE(?, valorsugerido),
        frete = COALESCE(?, frete),
        link = COALESCE(?, link),
        vendedor = COALESCE(?, vendedor),
        image_url = COALESCE(?, image_url),
        descricao = COALESCE(?, descricao)
      WHERE id = ?`,
      [
        icone, tipodeproduto, classedoproduto, loja, categoria, nome,
        valorsugerido, frete, link, vendedor, image_url, descricao,
        id
      ]
    );

    const updatedProduct = await this.findById(id);
    return updatedProduct;
  }

  static async delete(id) {
    const db = getDb();
    
    const existingProduct = await this.findById(id);
    if (!existingProduct) {
      return null;
    }

    await db.run('DELETE FROM produtos WHERE id = ?', [id]);
    return existingProduct;
  }

  static async count(options = {}) {
    const db = getDb();
    const { categoria, search } = options;
    
    let query = 'SELECT COUNT(*) as total FROM produtos';
    let params = [];
    let conditions = [];

    if (categoria) {
      conditions.push('categoria LIKE ?');
      params.push(`%${categoria}%`);
    }

    if (search) {
      conditions.push('(nome LIKE ? OR loja LIKE ? OR vendedor LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await db.get(query, params);
    return result.total;
  }

  static async findByCategoria(categoria) {
    const db = getDb();
    const products = await db.all(
      'SELECT * FROM produtos WHERE categoria LIKE ? ORDER BY id DESC',
      [`%${categoria}%`]
    );
    return products;
  }

  static async findByLoja(loja) {
    const db = getDb();
    const products = await db.all(
      'SELECT * FROM produtos WHERE loja LIKE ? ORDER BY id DESC',
      [`%${loja}%`]
    );
    return products;
  }

  static async findByLink(link) {
    const db = getDb();
    const products = await db.all(
      'SELECT * FROM produtos WHERE link LIKE ? ORDER BY id DESC',
      [`%${link}%`]
    );
    return products;
  }

  static async findWithImages(options = {}) {
    const db = getDb();
    const { limit = 100, offset = 0 } = options;
    
    const products = await db.all(
      `SELECT * FROM produtos 
       WHERE image_url IS NOT NULL AND image_url != '' 
       ORDER BY id DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return products;
  }
}

module.exports = Produto;