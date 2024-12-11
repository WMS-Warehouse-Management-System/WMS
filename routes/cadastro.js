const express = require('express');
const router = express.Router();
const multer = require('multer');
const sql = require('mssql');
const dbPromise = require('../db'); 

// Configuração do multer para upload de imagens
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB para imagens
});

// Middleware de validação de sessão
const verificarSessao = (req, res, next) => {
    if (!req.usuario) {
        console.log("Usuário não encontrado na sessão."); // Log para verificar
        return res.status(401).send({ error: 'Usuário não logado. Por favor, faça login.' });
    }
    console.log("Usuário encontrado na sessão:", req.usuario); // Log para verificar
    next();
};


// Rotas para cada etapa do cadastro
router.get('/cadastro1', (req, res) => res.render('cadastro1'));

router.post('/cadastro1', (req, res) => {
    const { codigo, nomeBasico, nomeModificador, descricaoTecnica } = req.body;
    if (!nomeBasico || !nomeModificador) {
        return res.status(400).send({ error: 'Preencha todos os campos obrigatórios.' });
    }
    req.session.produto = { codigo, nomeBasico, nomeModificador, descricaoTecnica };
    res.redirect('/cadastro/cadastro2');
});

router.get('/cadastro2', verificarSessao, (req, res) => res.render('cadastro2'));

router.post('/cadastro2', verificarSessao, (req, res) => {
    const { fabricante, fragilidade, unidade, precoVenda } = req.body;
    req.session.produto = {
        ...req.session.produto,
        fabricante,
        unidade,
        precoVenda: parseFloat(precoVenda),
        fragilidade: fragilidade === 'on' ? 1 : 0,
    };

    res.redirect('/cadastro/cadastro3');
});

router.get('/cadastro3', verificarSessao, (req, res) => res.render('cadastro3'));

router.post('/cadastro3', verificarSessao, (req, res) => {
    const { rua, coluna, andar } = req.body;
    req.session.produto = {
        ...req.session.produto,
        rua: parseInt(rua),
        coluna: parseInt(coluna),
        andar: parseInt(andar),
    };
    res.redirect('/cadastro/cadastro4');
});

router.get('/cadastro4', verificarSessao, (req, res) => res.render('cadastro4'));

router.post('/cadastro4', verificarSessao, (req, res) => {
    const { altura, largura, profundidade, peso } = req.body;
    req.session.produto = {
        ...req.session.produto,
        altura: parseFloat(altura),
        largura: parseFloat(largura),
        profundidade: parseFloat(profundidade),
        peso: parseFloat(peso),
    };
    res.redirect('/cadastro/cadastro5');
});

router.get('/cadastro5', verificarSessao, (req, res) => res.render('cadastro5'));

router.post('/cadastro5', upload.single('imagem'), async (req, res) => {
    const { observacao } = req.body;
    const imagem = req.file ? req.file.buffer : null;

    try {
        const produtoCompleto = {
            ...req.session.produto,
            observacao,
            imagem,
            inserido_por: req.usuario.tipo === 'professor' 
                ? req.usuario.SN 
                : req.usuario.email,
        };

        const pool = await dbPromise;
        await pool.request()
            .input('CODIGO', sql.NVarChar, produtoCompleto.codigo)
            .input('NOME_BASICO', sql.NVarChar, produtoCompleto.nomeBasico)
            .input('NOME_MODIFICADOR', sql.NVarChar, produtoCompleto.nomeModificador)
            .input('DESCRICAO_TECNICA', sql.NVarChar, produtoCompleto.descricaoTecnica)
            .input('FABRICANTE', sql.NVarChar, produtoCompleto.fabricante)
            .input('OBSERVACOES_ADICIONAL', sql.NVarChar, produtoCompleto.observacao)
            .input('IMAGEM', sql.VarBinary, produtoCompleto.imagem)
            .input('UNIDADE', sql.NVarChar, produtoCompleto.unidade)
            .input('PRECO_DE_VENDA', sql.Decimal, produtoCompleto.precoVenda)
            .input('FRAGILIDADE', sql.Bit, produtoCompleto.fragilidade)
            .input('RUA', sql.Int, produtoCompleto.rua)
            .input('COLUNA', sql.Int, produtoCompleto.coluna)
            .input('ANDAR', sql.Int, produtoCompleto.andar)
            .input('ALTURA', sql.Float, produtoCompleto.altura)
            .input('LARGURA', sql.Float, produtoCompleto.largura)
            .input('PROFUNDIDADE', sql.Float, produtoCompleto.profundidade)
            .input('PESO', sql.Float, produtoCompleto.peso)
            .input('INSERIDO_POR', sql.NVarChar, produtoCompleto.inserido_por)
            .query(`
                INSERT INTO DimProduto (
                    CODIGO, NOME_BASICO, NOME_MODIFICADOR, DESCRICAO_TECNICA, FABRICANTE,
                    OBSERVACOES_ADICIONAL, IMAGEM, UNIDADE, PRECO_DE_VENDA, FRAGILIDADE,
                    RUA, COLUNA, ANDAR, ALTURA, LARGURA, PROFUNDIDADE, PESO, inserido_por
                ) VALUES (
                    @CODIGO, @NOME_BASICO, @NOME_MODIFICADOR, @DESCRICAO_TECNICA, @FABRICANTE,
                    @OBSERVACOES_ADICIONAL, @IMAGEM, @UNIDADE, @PRECO_DE_VENDA, @FRAGILIDADE,
                    @RUA, @COLUNA, @ANDAR, @ALTURA, @LARGURA, @PROFUNDIDADE, @PESO, @INSERIDO_POR
                )
            `);

        req.session.produto = null;
        res.json({ success: true, message: 'Produto cadastrado com sucesso! ', usuario: req.usuario });
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        res.status(500).send({ error: 'Erro ao cadastrar produto.' });
    }
});

module.exports = router;
