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

// Rota principal com HTML
app.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Favela Eco's Marketplace - API</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Courier New', monospace;
            background: #0a0a0a;
            color: #00ff41;
            padding: 40px 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: #111;
            border: 1px solid #00ff41;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.1);
        }
        h1 {
            color: #00ff41;
            font-size: 28px;
            border-bottom: 2px solid #00ff41;
            padding-bottom: 15px;
            margin-bottom: 25px;
            letter-spacing: 2px;
        }
        h1 span {
            color: #fff;
        }
        .status {
            display: inline-block;
            background: #00ff41;
            color: #000;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            margin-left: 10px;
        }
        .section {
            margin: 30px 0 20px 0;
            padding: 15px 0;
            border-top: 1px dashed #333;
        }
        .section-title {
            color: #00ff41;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            letter-spacing: 1px;
        }
        .endpoint {
            background: #1a1a1a;
            padding: 12px 18px;
            margin-bottom: 8px;
            border-radius: 4px;
            border-left: 3px solid #00ff41;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px;
        }
        .method {
            display: inline-block;
            font-weight: bold;
            font-size: 13px;
            min-width: 60px;
            color: #000;
            background: #00ff41;
            padding: 2px 10px;
            border-radius: 3px;
            text-align: center;
        }
        .method.post { background: #ffa500; }
        .method.put { background: #ff6b6b; color: #fff; }
        .method.patch { background: #4ecdc4; color: #000; }
        .method.delete { background: #ff4444; color: #fff; }
        .url {
            color: #fff;
            font-size: 15px;
            word-break: break-all;
            flex: 1;
        }
        .url a {
            color: #00ff41;
            text-decoration: none;
        }
        .url a:hover {
            text-decoration: underline;
        }
        .desc {
            color: #888;
            font-size: 13px;
            width: 100%;
            margin-top: 4px;
            padding-left: 10px;
            border-left: 2px solid #333;
        }
        .footer {
            margin-top: 35px;
            padding-top: 20px;
            border-top: 1px solid #333;
            color: #555;
            font-size: 13px;
            text-align: center;
        }
        .footer a {
            color: #00ff41;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .exemplo {
            background: #0a0a0a;
            padding: 10px 15px;
            border-radius: 4px;
            color: #888;
            font-size: 13px;
            margin-top: 5px;
            border: 1px solid #222;
            word-break: break-all;
        }
        .exemplo span {
            color: #00ff41;
        }
        @media (max-width: 600px) {
            .container { padding: 20px; }
            h1 { font-size: 20px; }
            .endpoint { flex-direction: column; align-items: flex-start; }
            .method { min-width: auto; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>
            🌿 Favela Eco's Marketplace
            <span class="status">ONLINE</span>
        </h1>
        <p style="color: #888; margin-bottom: 10px;">
            API para gerenciamento de produtos e categorias
        </p>
        <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
            Versão: ${packageJson.version}
        </p>

        <!-- ============================================ -->
        <!-- PRODUTOS -->
        <!-- ============================================ -->
        <div class="section">
            <div class="section-title">📦 PRODUTOS</div>

            <div class="endpoint">
                <span class="method">GET</span>
                <span class="url"><a href="${baseUrl}/api/produtos" target="_blank">/api/produtos</a></span>
                <div class="desc">Listar todos os produtos cadastrados</div>
            </div>

            <div class="endpoint">
                <span class="method">GET</span>
                <span class="url"><a href="${baseUrl}/api/produtos/1" target="_blank">/api/produtos/:id</a></span>
                <div class="desc">Buscar um produto específico pelo ID (ex: /api/produtos/1)</div>
            </div>

            <div class="endpoint">
                <span class="method post">POST</span>
                <span class="url">/api/produtos</span>
                <div class="desc">Criar um novo produto (enviar dados em JSON no corpo da requisição)</div>
            </div>

            <div class="endpoint">
                <span class="method put">PUT</span>
                <span class="url">/api/produtos/:id</span>
                <div class="desc">Atualizar um produto completo pelo ID</div>
            </div>

            <div class="endpoint">
                <span class="method patch">PATCH</span>
                <span class="url">/api/produtos/:id</span>
                <div class="desc">Atualizar campos específicos de um produto (atualização parcial)</div>
            </div>

            <div class="endpoint">
                <span class="method delete">DELETE</span>
                <span class="url">/api/produtos/:id</span>
                <div class="desc">Remover um produto do banco de dados</div>
            </div>

            <div class="endpoint">
                <span class="method">GET</span>
                <span class="url"><a href="${baseUrl}/api/produtos/categoria/Chapéus" target="_blank">/api/produtos/categoria/:categoria</a></span>
                <div class="desc">Filtrar produtos por categoria (ex: /api/produtos/categoria/Chapéus)</div>
            </div>

            <div class="endpoint">
                <span class="method">GET</span>
                <span class="url"><a href="${baseUrl}/api/produtos/loja/Amazon" target="_blank">/api/produtos/loja/:loja</a></span>
                <div class="desc">Filtrar produtos por loja (ex: /api/produtos/loja/Amazon)</div>
            </div>

            <div class="endpoint">
                <span class="method">GET</span>
                <span class="url"><a href="${baseUrl}/api/produtos?search=chapéu" target="_blank">/api/produtos?search=:termo</a></span>
                <div class="desc">Pesquisar produtos por nome, loja ou vendedor (ex: /api/produtos?search=chapéu)</div>
            </div>

            <div class="endpoint">
                <span class="method">GET</span>
                <span class="url"><a href="${baseUrl}/api/produtos/with-images" target="_blank">/api/produtos/with-images</a></span>
                <div class="desc">Listar apenas produtos que possuem imagens cadastradas</div>
            </div>

            <div class="exemplo">
                <span>📌 Exemplo:</span> ${baseUrl}/api/produtos
            </div>
        </div>

        <!-- ============================================ -->
        <!-- CATEGORIAS -->
        <!-- ============================================ -->
        <div class="section">
            <div class="section-title">📂 CATEGORIAS</div>

            <div class="endpoint">
                <span class="method">GET</span>
                <span class="url"><a href="${baseUrl}/api/categorias" target="_blank">/api/categorias</a></span>
                <div class="desc">Listar todas as categorias cadastradas</div>
            </div>

            <div class="endpoint">
                <span class="method">GET</span>
                <span class="url"><a href="${baseUrl}/api/categorias/1" target="_blank">/api/categorias/:id</a></span>
                <div class="desc">Buscar uma categoria específica pelo ID (ex: /api/categorias/1)</div>
            </div>

            <div class="endpoint">
                <span class="method post">POST</span>
                <span class="url">/api/categorias</span>
                <div class="desc">Criar uma nova categoria (enviar dados em JSON no corpo da requisição)</div>
            </div>

            <div class="endpoint">
                <span class="method put">PUT</span>
                <span class="url">/api/categorias/:id</span>
                <div class="desc">Atualizar uma categoria existente pelo ID</div>
            </div>

            <div class="endpoint">
                <span class="method delete">DELETE</span>
                <span class="url">/api/categorias/:id</span>
                <div class="desc">Remover uma categoria do banco de dados</div>
            </div>

            <div class="exemplo">
                <span>📌 Exemplo:</span> ${baseUrl}/api/categorias
            </div>
        </div>

        <!-- ============================================ -->
        <!-- HEALTH CHECK -->
        <!-- ============================================ -->
        <div class="section">
            <div class="section-title">❤️ HEALTH CHECK</div>

            <div class="endpoint">
                <span class="method">GET</span>
                <span class="url"><a href="${baseUrl}/api/health" target="_blank">/api/health</a></span>
                <div class="desc">Verificar se a API está funcionando corretamente</div>
            </div>

            <div class="exemplo">
                <span>📌 Exemplo:</span> ${baseUrl}/api/health
            </div>
        </div>

        <!-- ============================================ -->
        <!-- RODAPÉ -->
        <!-- ============================================ -->
        <div class="footer">
            <p>
                🔗 <a href="https://github.com/crialab360/favelaecosmarketplaceBackEnd" target="_blank">GitHub do Projeto</a> &nbsp;|&nbsp;
                📅 ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} 
                &nbsp;|&nbsp; 🟢 API Online
            </p>
            <p style="margin-top: 5px; color: #444;">
                Favela Eco's Marketplace - API v${packageJson.version}
            </p>
        </div>
    </div>
</body>
</html>
  `);
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