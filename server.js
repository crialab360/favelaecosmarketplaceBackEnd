require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');
const { initializeDatabase } = require('./src/config/database');
const packageJson = require('./package.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api', routes);

// Rota principal com documentação
app.get('/', (req, res) => {
  res.json({
    name: 'Favela Eco\'s Marketplace API',
    version: packageJson.version,
    description: 'API para gerenciamento de produtos do marketplace',
    status: '🟢 Online',
    endpoints: {
      'Listar todos os produtos': {
        method: 'GET',
        url: `${req.protocol}://${req.get('host')}/api/produtos`,
        description: 'Retorna todos os produtos cadastrados'
      },
      'Buscar produto por ID': {
        method: 'GET',
        url: `${req.protocol}://${req.get('host')}/api/produtos/:id`,
        description: 'Retorna um produto específico pelo ID (ex: /api/produtos/1)'
      },
      'Criar novo produto': {
        method: 'POST',
        url: `${req.protocol}://${req.get('host')}/api/produtos`,
        description: 'Cadastra um novo produto (envie os dados em JSON no corpo da requisição)'
      },
      'Atualizar produto': {
        method: 'PUT',
        url: `${req.protocol}://${req.get('host')}/api/produtos/:id`,
        description: 'Atualiza um produto existente pelo ID'
      },
      'Atualizar parcialmente': {
        method: 'PATCH',
        url: `${req.protocol}://${req.get('host')}/api/produtos/:id`,
        description: 'Atualiza campos específicos de um produto'
      },
      'Deletar produto': {
        method: 'DELETE',
        url: `${req.protocol}://${req.get('host')}/api/produtos/:id`,
        description: 'Remove um produto do banco de dados'
      },
      'Filtrar por categoria': {
        method: 'GET',
        url: `${req.protocol}://${req.get('host')}/api/produtos/categoria/:categoria`,
        description: 'Exemplo: /api/produtos/categoria/Chapéus'
      },
      'Filtrar por loja': {
        method: 'GET',
        url: `${req.protocol}://${req.get('host')}/api/produtos/loja/:loja`,
        description: 'Exemplo: /api/produtos/loja/Amazon'
      },
      'Pesquisar produtos': {
        method: 'GET',
        url: `${req.protocol}://${req.get('host')}/api/produtos?search=:termo`,
        description: 'Exemplo: /api/produtos?search=chapéu'
      },
      'Health Check': {
        method: 'GET',
        url: `${req.protocol}://${req.get('host')}/api/health`,
        description: 'Verifica se a API está funcionando'
      }
    },
    exemplos: {
      '📦 Ver todos os produtos': `${req.protocol}://${req.get('host')}/api/produtos`,
      '🔍 Buscar produto por ID': `${req.protocol}://${req.get('host')}/api/produtos/1`,
      '📊 Health Check': `${req.protocol}://${req.get('host')}/api/health`
    },
    documentacao: 'https://github.com/crialab360/favelaecosmarketplaceBackEnd',
    data: new Date().toISOString()
  });
});

// Middleware de erro global
app.use(errorHandler);

// Inicializar banco de dados e iniciar servidor
async function startServer() {
  try {
    await initializeDatabase();
    console.log('✅ Banco de dados inicializado com sucesso!');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📝 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`📖 Documentação disponível em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();