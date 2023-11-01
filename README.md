# books
Aula backend NodeJS - API books

Executar na sequência para rodar aplicação:
npm install express
npm install mysql
npm install mysql2
node app.js

Criar Banco com:
CREATE TABLE livros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL
);
