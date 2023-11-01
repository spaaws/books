const express = require('express');
const app = express();
const port = 3000;
const pgp = require('pg-promise')();

// Configuração da conexão com o banco de dados PostgreSQL
const db = pgp({
  connectionString: 'postgres://books_api_kwsb_user:5eODoIYA0L5RCQ1RS3Qti9HXuZtd3vmb@dpg-cl11pdgp2gis73bdrl0g-a/books_api_kwsb',
});

// Conexão ao banco de dados PostgreSQL
db.connect()
  .then(obj => {
    console.log('Conexão ao banco de dados PostgreSQL estabelecida com sucesso');
    obj.done(); // Liberar a conexão
  })
  .catch(error => {
    console.error('Erro ao conectar ao banco de dados PostgreSQL:', error);
    process.exit(1);
  });

app.use(express.json());

// Middleware de log para registrar solicitações
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota para listar todos os livros
app.get('/books', async (req, res) => {
  try {
    const books = await db.any('SELECT * FROM livros');
    res.json(books);
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    res.status(500).json({ error: 'Erro ao buscar livros' });
  }
});

// Rota para criar um novo livro
app.post('/books', async (req, res) => {
  const { title, author } = req.body;
  try {
    await db.none('INSERT INTO livros (title, author) VALUES ($1, $2)', [title, author]);
    res.status(201).json({ message: 'Livro criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar um livro:', error);
    res.status(500).json({ error: 'Erro ao criar um livro' });
  }
});

// Rota para atualizar um livro por ID
app.put('/books/:id', async (req, res) => {
  const id = req.params.id;
  const { title, author } = req.body;
  try {
    await db.none('UPDATE livros SET title = $1, author = $2 WHERE id = $3', [title, author, id]);
    res.json({ message: 'Livro atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar o livro:', error);
    res.status(500).json({ error: 'Erro ao atualizar o livro' });
  }
});

// Rota para excluir um livro por ID
app.delete('/books/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.none('DELETE FROM livros WHERE id = $1', [id]);
    res.json({ message: 'Livro excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir o livro:', error);
    res.status(500).json({ error: 'Erro ao excluir o livro' });
  }
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
