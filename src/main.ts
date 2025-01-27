import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'
import BancoMysql from './db/banco-mysql'

const app = express()
app.use(express.json())
app.use(cors())

class BancoMysql {
  private connection: mysql.Connection;

  async criarConexao() {
    this.connection = await mysql.createConnection({
      host: process.env.dbhost || "localhost",
      user: process.env.dbuser || "root",
      password: process.env.dbpassword || "",
      database: process.env.dbname || "banco1022a",
      port: process.env.dbport ? parseInt(process.env.dbport) : 3306
    });
  }

  async finalizarConexao() {
    await this.connection.end();
  }

  async listar() {
    const [result] = await this.connection.query("SELECT * from produtos");
    return result;
  }

  async listarPorId(id: number) {
    const [result] = await this.connection.query("SELECT * from produtos WHERE id = ?", [id]);
    return result;
  }

  async inserir(produto: any) {
    const [result] = await this.connection.query("INSERT INTO produtos SET ?", produto);
    return result;
  }

  async excluir(id: number) {
    const [result] = await this.connection.query("DELETE from produtos WHERE id = ?", [id]);
    return result;
  }

  async alterar(id: number, produto: any) {
    const [result] = await this.connection.query("UPDATE produtos SET ? WHERE id = ?", [produto, id]);
    return result;
  }
}

app.get("/produtos", async (req, res) => {
  try {
    const banco = new BancoMysql()
    await banco.criarConexao()
    const result = await banco.listar()
    await banco.finalizarConexao()
    res.send(result)
  } catch (e) {
    console.log(e)
    res.status(500).send("Server ERROR")
  }
})

app.get("/produtos/:id", async (req, res) => {
  try {
    const banco = new BancoMysql()
    await banco.criarConexao()
    const result = await banco.listarPorId(parseInt(req.params.id))
    await banco.finalizarConexao()
    res.send(result)
  } catch (e) {
    console.log(e)
    res.status(500).send("Server ERROR")
  }
})

app.post("/produtos", async (req, res) => {
  try {
    const { id, nome, descricao, preco, imagem } = req.body
    const banco = new BancoMysql()
    await banco.criarConexao()
    const produto = { id: parseInt(id), nome, descricao, preco, imagem }
    const result = await banco.inserir(produto)
    await banco.finalizarConexao()
    res.send(result)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

app.delete("/produtos/:id", async (req, res) => {
  try {
    const banco = new BancoMysql()
    await banco.criarConexao()
    const result = await banco.excluir(parseInt(req.params.id))
    await banco.finalizarConexao()
    res.status(200).send("Produto excluido com sucesso id: " + req.params.id)
  } catch (e) {
    console.log(e)
    res.status(500).send("Erro ao excluir")
  }
})

app.put("/produtos/:id", async (req, res) => {
  const { nome, descricao, preco, imagem } = req.body
  const produto = { nome, descricao, preco, imagem }
  const banco = new BancoMysql()
  await banco.criarConexao()
  const result = await banco.alterar(parseInt(req.params.id), produto)
  await banco.finalizarConexao()
  res.status(200).send("Produto alterado com sucesso id: " + req.params.id)
})

app.listen(8000, () => {
  console.log("Iniciei o servidor")
})
