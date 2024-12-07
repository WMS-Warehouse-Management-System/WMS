
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();
const port = 3000;

const dbConfig = {
    user:'carlosBD',
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



// ------------------------------------------------ver produtos

app.get('/ver-catalogo', async (req, res) => {
    try {
        await sql.connect(dbConfig);

        const query = `SELECT 
        CODIGO
      ,NOME_BASICO
      ,NOME_MODIFICADOR
      ,DESCRICAO_TECNICA
      ,FABRICANTE
      ,OBSERVACOES_ADICIONAL
      ,IMAGEM
      ,UNIDADE
      ,PRECO_DE_VENDA
      , CASE
        WHEN FRAGILIDADE = 0 THEN 'NÃO'
        WHEN FRAGILIDADE = 1 THEN 'SIM'
        END AS FRAGILIDADE
      ,inserido_por
      ,RUA
      ,COLUNA
      ,ANDAR
      ,ALTURA
      ,LARGURA
      ,PROFUNDIDADE
      ,PESO 
      FROM DimProduto
      ORDER BY NOME_BASICO ASC`;
        const result = await new sql.Request().query(query);

        res.json(result.recordset); 
    } catch (error) {
        res.status(500).send('Erro ao obter os produtos: ' + error.message);
    }
});

// ----------------------------------FILTRO DE PESQUISA DO INPUT CATALOGO


app.get('/input-pesquisa', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        let pesquisaCatalogo = document.getElementById('pesquisa').value;

        const query = 
        `
    
        SELECT 
        CODIGO
      ,NOME_BASICO
      ,NOME_MODIFICADOR
      ,DESCRICAO_TECNICA
      ,FABRICANTE
      ,OBSERVACOES_ADICIONAL
      ,IMAGEM
      ,UNIDADE
      ,PRECO_DE_VENDA
      , CASE
        WHEN FRAGILIDADE = 0 THEN 'NÃO'
        WHEN FRAGILIDADE = 1 THEN 'SIM'
        END AS FRAGILIDADE
      ,inserido_por
      ,RUA
      ,COLUNA
      ,ANDAR
      ,ALTURA
      ,LARGURA
      ,PROFUNDIDADE
      ,PESO 
      FROM DimProduto
	  WHERE CODIGO = '${pesquisaCatalogo}'
      ORDER BY NOME_BASICO ASC
        `;
        const result = await new sql.Request().query(query);

        res.json(result.recordset); 
    } catch (error) {
        res.status(500).send('Erro ao obter os produtos: ' + error.message);
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

        let query;
        if (email.includes('@professor.com')) {
            // Consulta para professores
            query = `
                SELECT email, nome, senha, SN 
                FROM DimProfessor 
                WHERE email = @Email AND senha = @Senha
            `;
        } else {
            // Consulta para usuários comuns
            query = `
                SELECT email, nome, senha 
                FROM DimUsuario 
                WHERE email = @Email AND senha = @Senha
            `;
        }

        const request = new sql.Request();
        request.input('Email', sql.NVarChar, email);
        request.input('Senha', sql.NVarChar, senha);

        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(401).send('Email ou senha inválidos.');
        }

        const usuario = result.recordset[0];
        res.send({
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                email: usuario.email,
                nome: usuario.nome,
                tipo: email.includes('@professor.com') ? 'professor' : 'usuario',
                SN: usuario.SN || null,
            },
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
        fabricante,
        fornecedor,
        enderecamento,
        observacoesAdicional,
        imagem,
        unidade,
        precoDeVenda,
        fragilidade,
        inseridoPor, // Recebe o valor definido no front-end
    } = req.body;

    try {
        await sql.connect(dbConfig);

        const query = `
            INSERT INTO DimProduto (
                CODIGO, NOME_BASICO, NOME_MODIFICADOR, DESCRICAO_TECNICA,
                FABRICANTE, FORNECEDOR, ENDERECAMENTO, OBSERVACOES_ADICIONAL,
                IMAGEM, UNIDADE, PRECO_DE_VENDA, FRAGILIDADE, INSERIDO_POR
            )
            VALUES (
                @codigo, @nomeBasico, @nomeModificador, @descricaoTecnica,
                @fabricante, @fornecedor, @enderecamento, @observacoesAdicional,
                @imagem, @unidade, @precoDeVenda, @fragilidade, @inseridoPor
            )
        `;

        const request = new sql.Request();
        request.input('codigo', sql.BigInt, codigo);
        request.input('nomeBasico', sql.NVarChar, nomeBasico);
        request.input('nomeModificador', sql.NVarChar, nomeModificador || null);
        request.input('descricaoTecnica', sql.NVarChar, descricaoTecnica || null);
        request.input('fabricante', sql.NVarChar, fabricante || null);
        request.input('fornecedor', sql.NVarChar, fornecedor || null);
        request.input('enderecamento', sql.NVarChar, enderecamento || null);
        request.input('observacoesAdicional', sql.NVarChar, observacoesAdicional || null);
        request.input('imagem', sql.VarBinary, imagem || null);
        request.input('unidade', sql.NVarChar, unidade || null);
        request.input('precoDeVenda', sql.Decimal, precoDeVenda);
        request.input('fragilidade', sql.Bit, fragilidade || 0);
        request.input('inseridoPor', sql.NVarChar, inseridoPor); // Inserido por pode ser SN ou email do usuário

        await request.query(query);

        res.send('Produto adicionado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao adicionar produto: ' + error.message);
    }
});



//------------------------------------------- vizualizar os recebimentos
app.get("/Recebimento", async (req, res) => {
    try {
      // Estabelecendo a conexão com o banco de dados
      let pool = await sql.connect(dbConfig);
      
      // Sua query SQL
      const query = `
        SELECT 
          FactRecebimento.DATA_RECEB,
          DimProduto.CODIGO,
          DimProduto.NOME_BASICO,
          DimProduto.FABRICANTE,
          FactRecebimento.Fornecedor,
          FactRecebimento.PRECO_DE_AQUISICAO,
          DimProduto.IMAGEM,
          FactRecebimento.QUANT,
          DimProduto.PRECO_DE_VENDA,
          DimProduto.FRAGILIDADE
        FROM FactRecebimento 
        INNER JOIN DimProduto ON FactRecebimento.CODIGO = DimProduto.CODIGO;
      `;
  
      // Executando a query
      const result = await pool.request().query(query);
  
      // Retorna os dados como JSON
      res.json(result.recordset);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      res.status(500).send("Erro ao buscar dados.");
    }
  });
  

//---------------------------------ADICIONAR PRODUTO FINANACEIRO 

app.post('/adicionar-recebimento', async (req, res) => {
    const {
        nomeBasico,
        fornecedor,
        codigo,
        quantidade,
        numbLote,
        dataRecebimento,
        validade,
        precoAqui
    } = req.body;

    try {
        await sql.connect(dbConfig);

        const query = `
        INSERT INTO FactRecebimento (
            DATA_RECEB, QUANT, CODIGO, VALIDADE,
            PRECO_DE_AQUISICAO, LOTE, FORNECEDOR
             
        )
        VALUES (
            @data_Receb, @quantidade, @codigo, @validade,  
            @precoAqui, @numbLote, @fornecedor
        )
    `;

        const request = new sql.Request();
        request.input('nomeBasico', sql.NVarChar, nomeBasico);
        request.input('fornecedor', sql.NVarChar, fornecedor);
        request.input('codigo', sql.BigInt, codigo);
        request.input('quantidade', sql.BigInt, quantidade);
        request.input('numbLote', sql.BigInt, numbLote);
        request.input('data_Receb', sql.DateTime, dataRecebimento);
        request.input('precoAqui', sql.Decimal, precoAqui);
        request.input('validade', sql.Date, validade);
        
        await request.query(query);

        res.send('Produto adicionado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao adicionar produto: ' + error.message);
    }
});


  //---------------------------------------------------------INserir dados no formulario recebimento

// Rota para receber os dados do formulário
app.post('/add-product', async (req, res) => {
    const { productName, productFont, productCode, quantityReceived, numbLote, receivingDate, productValidade } = req.body;

    try {
        // Conecta ao banco de dados usando a configuração definida em dbConfig
        let pool = await sql.connect(dbConfig);
    // Criar a consulta SQL para inserir os dados
    await pool.request()
    .input('Nome', sql.NVarChar, Nome)          // Define o parâmetro 'Nome' como NVarchar
    .input('Data', sql.Date, Data)  // Define o parâmetro 'Data' como Date com precisão
    .input('Quantidade', sql.Int, Quantidade)   // Define o parâmetro 'Quantidade' como Inteiro
    .input('Codigo', sql.BigInt, Codigo) // Define o parâmetro 'Codigo' como BigInt
    .input('Validade', sql.Date, Validade)
    .input('Lote', sql.NVarChar(30), Lote)
    .input('Fornecedor', sql.VarChar(225), Fornecedor)
    .query('INSERT INTO dbo.FactRecebimento ( DATA_RECEB, QUANT, CODIGO, VALIDADE, LOTE, FORNECEDOR) VALUES (@receivingDate, @quantityReceived, @productCode, @productValidade, @numbLote, @productFont)');

        // Retorna uma resposta de sucesso para o cliente
        res.status(200).send('Recebimento adicionado com sucesso!');
    } catch (err) {
        // Em caso de erro, loga o erro e retorna uma resposta de erro
        console.error('Erro ao adicionar recebimento:', err);
        res.status(500).send('Erro ao adicionar recebimento');
    }
});
// Inicia o servidor na porta definida e exibe uma mensagem no console

// -------------------------------------------grafico

app.get('/telaInicial', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const query = `
            SELECT dp.NOME_BASICO AS Produto, SUM(fr.QUANT) AS Quantidade
            FROM DimProduto dp
            JOIN FactRecebimento fr ON dp.CODIGO = fr.CODIGO
            GROUP BY dp.NOME_BASICO
            ORDER BY dp.NOME_BASICO;
        `;
        const result = await sql.query(query);

        const data = {
            categories: result.recordset.map(item => item.Produto),
            values: result.recordset.map(item => item.Quantidade),
        };

        res.json(data);
    } catch (err) {
        res.status(500).send('Erro ao buscar dados: ' + err.message);
    }
});



app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
  