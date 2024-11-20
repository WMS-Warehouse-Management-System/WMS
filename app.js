

const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();
const port = 3000;

const dbConfig = {
    user:'carlos',
    password: '1234',
    server: '127.0.0.1',
    database: 'WMS',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'

app.post('/adicionar-usuario', async (req, res) => {
    const { email,nome,senha,dataNasc,dataEntrada } = req.body;

    try {
        await sql.connect(dbConfig);
        
        
        // --------------------------------------------------------------adicionar
        
        
        const query = `
            INSERT INTO dimUsuario (email, nome, senha, dataNasc,dataEntrada)
            VALUES (@email, @nome,@senha, @dataNasc,@dataEntrada)
        `;
        const request = new sql.Request();
        request.input('email', sql.NVarChar, email);
        request.input('nome', sql.NVarChar, nome);
        request.input('senha', sql.NVarChar, senha);
        request.input('dataNasc', sql.Date, dataNasc);
        request.input('dataEntrada', sql.Date, dataEntrada);


        // ---------------------------------------------------------------


        await request.query(query);

        res.send('Usuario adicionado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao adicionar Usuario: ' + 'ta duplicano ai meu bom');
    }
});


// ------------------------------------------------------------------------------------deletar

app.post('/deletar-Usuario', async (req, res) => {
    const { email} = req.body;

    try {
        await sql.connect(dbConfig);
        
        
        // --------------------------------------------------------------
        
        
        const query = `
            delete dimUsuario where
            email= @email
        `;
        const request = new sql.Request();
        request.input('email', sql.NVarChar, email);
    


        // ---------------------------------------------------------------


        await request.query(query);

        res.send('Usuario deletado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao deletar Usuario: ' + error.message);
    }
});



// ----------------------------------------------consultar



app.get('/listar-usuarios', async (req, res) => {
    try {
        await sql.connect(dbConfig);

        const query = `SELECT email, nome, dataNasc, dataEntrada FROM dimUsuario`;
        const result = await new sql.Request().query(query);

        res.json(result.recordset); 
    } catch (error) {
        res.status(500).send('Erro ao obter usuários: ' + error.message);
    }
});


// ----------------------------------------------consultar view



app.get('/listar-usuarios-view', async (req, res) => {
    try {
        await sql.connect(dbConfig);

        const query = `SELECT  nome,senha FROM vw_Usuario`;
        const result = await new sql.Request().query(query);

        res.json(result.recordset);     
    } catch (error) {
        res.status(500).send('Erro ao obter usuários: ' + error.message);
    }
});

// -----------------------------------------------------adicionar-usuario
app.post('/adicionar-usuario', async (req, res) => {
    const { email,nome,senha,dataNasc,dataEntrada } = req.body;

    try {
        await sql.connect(dbConfig);
        
        
        const query = `
            INSERT INTO dimUsuario (email, nome, senha, dataNasc,dataEntrada)
            VALUES (@email, @nome,@senha, @dataNasc,@dataEntrada)
        `;
        const request = new sql.Request();
        request.input('email', sql.NVarChar, email);
        request.input('nome', sql.NVarChar, nome);
        request.input('senha', sql.NVarChar, senha);
        request.input('dataNasc', sql.Date, dataNasc);
        request.input('dataEntrada', sql.Date, dataEntrada);



        await request.query(query);

        res.send('Usuario adicionado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao adicionar Usuario: ' + 'ta duplicano ai meu bom');
    }
});

// ----------------------------------------------------login

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        await sql.connect(dbConfig);

        // Consulta para verificar email e senha
        const query = `
            SELECT email, nome 
            FROM dimUsuario 
            WHERE email = @Email AND senha = @Senha
        `;
        const request = new sql.Request();
        request.input('Email', sql.NVarChar, email);
        request.input('Senha', sql.NVarChar, senha);

        const result = await request.query(query);

        // Verifica se o usuário foi encontrado
        if (result.recordset.length === 0) {
            return res.status(401).send('Email ou senha inválidos.');
        }

        // Retorna os dados do usuário
        res.send({
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                email: result.recordset[0].email,
                nome: result.recordset[0].nome,
            }
        });
    } catch (error) {
        res.status(500).send('Erro ao fazer login: ' + error.message);
    }
});


// ---------------------------------------------------logout

app.post('/logout', async (req, res) => {
    const { email } = req.body;

    try {
        await sql.connect(dbConfig);

        const query = `
            UPDATE LoginsAtivos 
            SET logoutTimestamp = GETDATE()
            WHERE usuarioEmail = @Email AND logoutTimestamp IS NULL
        `;
        const request = new sql.Request();
        request.input('Email', sql.NVarChar, email);

        await request.query(query);

        res.send('Logout realizado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao fazer logout: ' + error.message);
    }
});
// --------------------------------------------------adicionar produto

app.post('/adicionar-produto', async (req, res) => {
    const {
        codigo,
        nomeBasico,
        nomeModificador,
        descricaoTecnica,
        precoDeAquisicao,
        fabricante,
        fornecedor,
        enderecamento,
        validade,
        observacoesAdicional,
        imagem,
        unidade,
        precoDeVenda,
        fragilidade,
        inseridoPor
    } = req.body;

    try {
        await sql.connect(dbConfig);

        const query = `
            INSERT INTO DimProduto (
                CODIGO, NOME_BASICO, NOME_MODIFICADOR, DESCRICAO_TECNICA, PRECO_DE_AQUISICAO,
                FABRICANTE, FORNECEDOR, ENDERECAMENTO, VALIDADE, OBSERVACOES_ADICIONAL,
                IMAGEM, UNIDADE, PRECO_DE_VENDA, FRAGILIDADE, inserido_por
            )
            VALUES (
                @codigo, @nomeBasico, @nomeModificador, @descricaoTecnica, @precoDeAquisicao,
                @fabricante, @fornecedor, @enderecamento, @validade, @observacoesAdicional,
                @imagem, @unidade, @precoDeVenda, @fragilidade, @inseridoPor
            )
        `;
        const request = new sql.Request();
        request.input('codigo', sql.BigInt, codigo);
        request.input('nomeBasico', sql.NVarChar, nomeBasico);
        request.input('nomeModificador', sql.NVarChar, nomeModificador || null);
        request.input('descricaoTecnica', sql.NVarChar, descricaoTecnica || null);
        request.input('precoDeAquisicao', sql.Decimal, precoDeAquisicao);
        request.input('fabricante', sql.NVarChar, fabricante || null);
        request.input('fornecedor', sql.NVarChar, fornecedor || null);
        request.input('enderecamento', sql.NVarChar, enderecamento || null);
        request.input('validade', sql.Date, validade || null);
        request.input('observacoesAdicional', sql.NVarChar, observacoesAdicional || null);
        request.input('imagem', sql.VarBinary, imagem || null);
        request.input('unidade', sql.NVarChar, unidade || null);
        request.input('precoDeVenda', sql.Decimal, precoDeVenda);
        request.input('fragilidade', sql.Bit, fragilidade || 0);
        request.input('inseridoPor', sql.NVarChar, inseridoPor);

        await request.query(query);

        res.send('Produto adicionado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao adicionar produto: ' + error.message);
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
