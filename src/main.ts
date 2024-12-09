import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'


const app = express()
app.use(express.json())
app.use(cors())

app.get("/livros", async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.dbhost ? process.env.dbhost : "mysql-marketplace1022a-estudante-c2ac.f.aivencloud.com",
            user: process.env.dbuser ? process.env.dbuser : "avnadmin",
            password: process.env.dbpassword ? process.env.dbpassword : "",
            database: process.env.dbname ? process.env.dbname : "defaultdb",
            port: process.env.dbport ? parseInt(process.env.dbport) : 18569
        })
        const [result, fields] = await connection.query("SELECT * from livros")
        await connection.end()
        res.send(result)
    } catch (e) {
        res.status(500).send("Server ERROR")
    }
})
app.post("/livros", async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.dbhost ? process.env.dbhost : "mysql-marketplace1022a-estudante-c2ac.f.aivencloud.com",
            user: process.env.dbuser ? process.env.dbuser : "avnadmin",
            password: process.env.dbpassword ? process.env.dbpassword : "",
            database: process.env.dbname ? process.env.dbname : "defaultdb",
            port: process.env.dbport ? parseInt(process.env.dbport) : 18569
        })
        const {id,titulo,autor, imagemLivro,genero,preco} = req.body
        const [result, fields] =
                    await connection.query("INSERT INTO livros VALUES (?,?,?,?,?,?)",
                            [id,titulo,autor,imagemLivro,genero,preco ])
        await connection.end()
        res.send(result)
    } catch (e) {
        console.log(e)
        res.status(500).send("Server ERROR")
    }
})



app.get("/usuarios", async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.dbhost ? process.env.dbhost : "mysql-marketplace1022a-estudante-c2ac.f.aivencloud.com",
            user: process.env.dbuser ? process.env.dbuser : "avnadmin",
            password: process.env.dbpassword ? process.env.dbpassword : "",
            database: process.env.dbname ? process.env.dbname : "defaultdb",
            port: process.env.dbport ? parseInt(process.env.dbport) : 18569
        })
        const [result, fields] = await connection.query("SELECT * from usuarios")
        await connection.end()
        res.send(result)
    } catch (e) {
        res.status(500).send(e)
    }
})


// Endpoint para cadastrar usuários
app.post("/usuarios", async (req, res) => {
    try {
        // Conexão com o banco de dados MySQL
        const connection = await mysql.createConnection({
            host: process.env.dbhost || "mysql-marketplace1022a-estudante-c2ac.f.aivencloud.com",
            user: process.env.dbuser || "avnadmin",
            password: process.env.dbpassword || "",
            database: process.env.dbname || "defaultdb",
            port: process.env.dbport ? parseInt(process.env.dbport) : 18569
        });


        // Pegando os dados enviados no corpo da requisição (do frontend)
        const { nome, email, enderecoEntrega } = req.body;
       
        // Inserindo no banco de dados
        const [result] = await connection.query(
            "INSERT INTO usuarios (nome, email, enderecoEntrega) VALUES (?, ?, ?)",
            [nome, email, enderecoEntrega]
        );
       
        // Fechando a conexão com o banco
        await connection.end();
       
        // Respondendo sucesso
        res.status(201).send(result); // Código 201: Criado com sucesso
    } catch (e) {
        // Caso haja algum erro
        console.error(e);
        res.status(500).send("Erro ao cadastrar usuário");
    }
});

// Endpoint para listar produtos
app.get("/produtos", async (req, res) => {
    try {
      const connection = await mysql.createConnection({
        host: process.env.dbhost ? process.env.dbhost : "mysql-marketplace1022a-estudante-c2ac.f.aivencloud.com",
            user: process.env.dbuser ? process.env.dbuser : "avnadmin",
            password: process.env.dbpassword ? process.env.dbpassword : "",
            database: process.env.dbname ? process.env.dbname : "defaultdb",
            port: process.env.dbport ? parseInt(process.env.dbport) : 18569
      });
  
      // Alterar a tabela para 'produtos' ou mantenha 'livros'
      const [result] = await connection.query("SELECT * FROM produtos");
      await connection.end();
      res.send(result);
    } catch (e) {
      console.log(e);
      res.status(500).send("Erro ao listar produtos");
    }
  });
  
  // Endpoint para cadastrar produtos
  app.post("/produtos", async (req, res) => {
    try {
      const connection = await mysql.createConnection({
        host: process.env.dbhost ? process.env.dbhost : "mysql-marketplace1022a-estudante-c2ac.f.aivencloud.com",
        user: process.env.dbuser ? process.env.dbuser : "avnadmin",
        password: process.env.dbpassword ? process.env.dbpassword : "",
        database: process.env.dbname ? process.env.dbname : "defaultdb",
        port: process.env.dbport ? parseInt(process.env.dbport) : 18569
      });
  
      const { titulo, autor, imagem, genero, preco } = req.body;
  
      // Altere o nome da tabela para 'produtos', ou mantenha como 'livros'
      const [result] = await connection.query("INSERT INTO produtos (titulo, autor, imagem, genero, preco) VALUES (?, ?, ?, ?, ?)", 
        [titulo, autor, imagem, genero, preco]);
  
      await connection.end();
      res.status(201).send(result);
    } catch (e) {
      console.log(e);
      res.status(500).send("Erro ao cadastrar produto");
    }
  });
  


app.listen(8000, () => {
    console.log("Iniciei o servidor")
})



