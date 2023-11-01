const express = require('express');
const app = express();
const port = 3000;

// Middleware para permitir o uso de JSON
app.use(express.json());

// Banco de dados simulado (em memória)
const books = [];

// Middleware de log para registrar solicitações
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas para o CRUD de livros

// Rota para listar todos os livros
app.get('/books', (req, res) => {
  console.log('Endpoint de listagem de livros acessado');
  res.json(books);
});

// Rota para criar um novo livro
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  const id = Date.now().toString(); // Gere um ID único (não recomendado para produção)
  const newBook = { id, title, author };
  books.push(newBook);
  console.log(`Novo livro criado: ${newBook.title} por ${newBook.author}`);
  res.status(201).json(newBook);
});

// Rota para atualizar um livro por ID
app.put('/books/:id', (req, res) => {
  const id = req.params.id;
  const bookIndex = books.findIndex((b) => b.id === id);
  if (bookIndex !== -1) {
    const { title, author } = req.body;
    books[bookIndex] = { id, title, author };
    console.log(`Livro atualizado: ${title} por ${author}`);
    res.json(books[bookIndex]);
  } else {
    res.status(404).json({ message: 'Livro não encontrado' });
  }
});

// Rota para excluir um livro por ID
app.delete('/books/:id', (req, res) => {
  const id = req.params.id;
  const bookIndex = books.findIndex((b) => b.id === id);
  if (bookIndex !== -1) {
    const deletedBook = books.splice(bookIndex, 1)[0];
    console.log(`Livro excluído: ${deletedBook.title} por ${deletedBook.author}`);
    res.json({ message: 'Livro excluído com sucesso' });
  } else {
    res.status(404).json({ message: 'Livro não encontrado' });
  }
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
