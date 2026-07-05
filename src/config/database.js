const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database/database.sqlite');

let db;

async function initializeDatabase() {
  try {
    const fs = require('fs');
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log('✅ Pasta database criada!');
    }

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('✅ Banco de dados SQLite conectado com sucesso!');
    await createTables();
    return db;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

async function createTables() {
  try {
    // Tabela de produtos
    await db.exec(`
      CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icone TEXT,
        tipodeproduto TEXT,
        classedoproduto TEXT DEFAULT 'badge-new',
        loja TEXT NOT NULL,
        categoria TEXT NOT NULL,
        nome TEXT NOT NULL,
        valorsugerido TEXT,
        frete TEXT,
        link TEXT,
        vendedor TEXT,
        image_url TEXT,
        descricao TEXT
      )
    `);

    console.log('✅ Tabela "produtos" criada/verificada com sucesso!');

    // Tabela de categorias
    await db.exec(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        icone TEXT,
        descricao TEXT,
        cor TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tabela "categorias" criada/verificada com sucesso!');

    // Inserir categorias padrão se a tabela estiver vazia
    const count = await db.get('SELECT COUNT(*) as total FROM categorias');
    if (count.total === 0) {
      await insertDefaultCategories();
    }

    // Inserir produtos de exemplo se a tabela estiver vazia
    const countProdutos = await db.get('SELECT COUNT(*) as total FROM produtos');
    if (countProdutos.total === 0) {
      await insertSampleData();
    }

  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  }
}

async function insertDefaultCategories() {
  try {
    const categories = [
      { nome: 'Cama, Mesa & Banho', icone: '🛏️', descricao: 'Produtos para cama, mesa e banho', cor: '#4A90D9' },
      { nome: 'Moda Feminina', icone: '👗', descricao: 'Vestidos, blusas, calças e acessórios femininos', cor: '#E91E63' },
      { nome: 'Joias & Bijoux', icone: '💎', descricao: 'Joias finas e bijuterias', cor: '#FFD700' },
      { nome: 'Alimentos', icone: '🍽️', descricao: 'Alimentos e bebidas', cor: '#4CAF50' },
      { nome: 'Eletrônicos', icone: '📱', descricao: 'Celulares, computadores e acessórios', cor: '#2196F3' },
      { nome: 'Beleza', icone: '💄', descricao: 'Cosméticos, perfumes e cuidados pessoais', cor: '#9C27B0' },
      { nome: 'Chapéus & Bonés', icone: '🧢', descricao: 'Chapéus, bonés e acessórios para cabeça', cor: '#FF9800' }
    ];

    for (const cat of categories) {
      await db.run(
        `INSERT INTO categorias (nome, icone, descricao, cor) VALUES (?, ?, ?, ?)`,
        [cat.nome, cat.icone, cat.descricao, cat.cor]
      );
    }

    console.log('✅ Categorias padrão inseridas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inserir categorias padrão:', error);
  }
}

async function insertSampleData() {
  try {
    const sampleProducts = [
      {
        icone: '👒',
        tipodeproduto: 'ARTESANAL',
        classedoproduto: 'badge-new',
        loja: 'Amazon',
        categoria: 'Chapéus & Bonés',
        nome: 'Chapéu Aba Larga Palha Natural Artesanal Praia Verão',
        valorsugerido: 'R$ 44,90',
        frete: '✓ Frete Grátis Prime',
        link: 'https://www.amazon.com.br/s?k=chapeu+aba+larga+palha+artesanal',
        vendedor: 'Amazon Brasil',
        image_url: 'https://via.placeholder.com/300x300',
        descricao: 'Chapéu de palha natural artesanal, ideal para praia e verão'
      },
      {
        icone: '👗',
        tipodeproduto: 'NOVO',
        classedoproduto: 'badge-new',
        loja: 'Shopee',
        categoria: 'Moda Feminina',
        nome: 'Vestido Floral Verão 2026',
        valorsugerido: 'R$ 89,90',
        frete: '✓ Frete Grátis',
        link: 'https://shopee.com.br/vestido-floral',
        vendedor: 'Moda Fashion',
        image_url: 'https://via.placeholder.com/300x300',
        descricao: 'Vestido floral leve e confortável para o verão'
      }
    ];

    for (const product of sampleProducts) {
      await db.run(
        `INSERT INTO produtos (
          icone, tipodeproduto, classedoproduto, loja, categoria, nome,
          valorsugerido, frete, link, vendedor, image_url, descricao
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.icone, product.tipodeproduto, product.classedoproduto,
          product.loja, product.categoria, product.nome,
          product.valorsugerido, product.frete, product.link,
          product.vendedor, product.image_url, product.descricao
        ]
      );
    }

    console.log('✅ Dados de exemplo inseridos com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inserir dados de exemplo:', error);
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

module.exports = {
  initializeDatabase,
  getDb
};