const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: '172.22.0.2',
  user: 'root',
  password: 'root',
  database: 'books'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  }
  console.log('Conexão ao banco de dados MySQL estabelecida com sucesso');
});

app.use(express.json());

// Middleware de log para registrar solicitações
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota para listar todos os livros
app.get('/books', (req, res) => {
  connection.query('SELECT * FROM livros', (error, results, fields) => {
    if (error) {
      console.error('Erro ao buscar livros:', error);
      res.status(500).json({ error: 'Erro ao buscar livros' });
      return;
    }
    res.json(results);
  });
});

// Rota para criar um novo livro
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  connection.query('INSERT INTO livros (title, author) VALUES (?, ?)', [title, author], (error, results, fields) => {
    if (error) {
      console.error('Erro ao criar um livro:', error);
      res.status(500).json({ error: 'Erro ao criar um livro' });
      return;
    }
    res.status(201).json({ message: 'Livro criado com sucesso' });
  });
});

// Rota para atualizar um livro por ID
app.put('/books/:id', (req, res) => {
  const id = req.params.id;
  const { title, author } = req.body;
  connection.query('UPDATE livros SET title = ?, author = ? WHERE id = ?', [title, author, id], (error, results, fields) => {
    if (error) {
      console.error('Erro ao atualizar o livro:', error);
      res.status(500).json({ error: 'Erro ao atualizar o livro' });
      return;
    }
    res.json({ message: 'Livro atualizado com sucesso' });
  });
});

// Rota para excluir um livro por ID
app.delete('/books/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM livros WHERE id = ?', [id], (error, results, fields) => {
    if (error) {
      console.error('Erro ao excluir o livro:', error);
      res.status(500).json({ error: 'Erro ao excluir o livro' });
      return;
    }
    res.json({ message: 'Livro excluído com sucesso' });
  });
});

// Encerramento da conexão com o banco de dados no encerramento da aplicação
process.on('exit', () => {
  connection.end();
  console.log('Conexão com o banco de dados encerrada');
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
