import mysql , { Connection, RowDataPacket } from 'mysql2/promise'
class BancoMysql{
    //Atributos de uma classe
    connection:Connection|null = null
    
    //Métodos
    async criarConexao(){
        this.connection = await mysql.createConnection({
            host: process.env.dbhost ? process.env.dbhost : "localhost",
            user: process.env.dbuser ? process.env.dbuser : "root",
            password: process.env.dbpassword ? process.env.dbpassword : "",
            database: process.env.dbname ? process.env.dbname : "banco1022a",
            port: process.env.dbport ? parseInt(process.env.dbport) : 3306
        })
    }
    async consultar(query:string,params?:any[]){
        if(!this.connection) throw new Error("Erro de conexão com o banco de dados.")
        const [result, fields] = await this.connection.query(query,params)
        return result
    }
    async finalizarConexao(){
        if(!this.connection) throw new Error("Erro de conexão com o banco de dados.")
        await this.connection.end()
    }
    async listar(){
        if(!this.connection) throw new Error("Erro de conexão com o banco de dados.")
        const [result, fields] = await this.connection.query("SELECT * FROM produtos")
        return result
    }
    async inserir(produto:{id?:number,titulo:string,descricao:string,preco:string,genero:string, autor:string, imagem:string}){
        if(!this.connection) throw new Error("Erro de conexão com o banco de dados.")
        const [result, fields] = await this.connection.query("INSERT INTO produtos VALUES (?,?,?,?,?,?,?)",[produto.id,produto.titulo,produto.descricao,produto.preco,produto.imagem,produto.genero,produto.autor])
        return result
    }
    async excluir(id:string){
        if(!this.connection) throw new Error("Erro de conexão com o banco de dados.")
        const [result, fields] = await this.connection.query("DELETE FROM produtos WHERE id = ?",[id])
        return result
    }
    async alterar(id:string,produto:{id?:number,titulo:string,descricao:string,preco:string,genero:string, autor:string, imagem:string}){
        if(!this.connection) throw new Error("Erro de conexão com o banco de dados.")
        const [result, fields] = await this.connection.query("UPDATE produtos SET titulo=?,descricao=?,preco=?,genero=?,autor=?,imagem=? WHERE id=?",[produto.titulo,produto.descricao,produto.preco,produto.imagem,id, produto.genero,produto.autor])
        return result
    }
    async listarPorId(id:string){
        if(!this.connection) throw new Error("Erro de conexão com o banco de dados.")
        const [result, fields] = await this.connection.query("SELECT * FROM produtos WHERE id = ?",[id]) as RowDataPacket[]
        return result[0]
    }
}

export default BancoMysql