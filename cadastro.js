const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuração do multer para upload de imagens
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB para imagens
});

// Rota GET e POST para cada etapa do cadastro

// Tela 1 - Cadastro 1
router.get('/cadastro1', (req, res) => {
    res.render('cadastro1');
});

router.post('/cadastro1', (req, res) => {
    const { nomeBasico, nomeModificador } = req.body;
    req.session.produto = { nomeBasico, nomeModificador }; // Salva dados na sessão
    res.redirect('/cadastro/cadastro2'); // Vai para a próxima etapa
});

// Tela 2 - Cadastro 2
router.get('/cadastro2', (req, res) => {
    res.render('cadastro2');
});

router.post('/cadastro2', (req, res) => {
    const { fabricante, observacoesAdicional } = req.body;
    req.session.produto = { 
        ...req.session.produto, 
        fabricante, 
        observacoesAdicional 
    };
    res.redirect('/cadastro/cadastro3');
});

// Tela 3 - Cadastro 3
router.get('/cadastro3', (req, res) => {
    res.render('cadastro3');
});

router.post('/cadastro3', (req, res) => {
    const { unidade, precoDeVenda, fragilidade } = req.body;
    req.session.produto = { 
        ...req.session.produto, 
        unidade, 
        precoDeVenda: parseFloat(precoDeVenda), 
        fragilidade: fragilidade === 'on' ? 1 : 0 
    };
    res.redirect('/cadastro/cadastro4');
});

// Tela 4 - Cadastro 4
router.get('/cadastro4', (req, res) => {
    res.render('cadastro4');
});

router.post('/cadastro4', (req, res) => {
    const { rua, coluna, andar, altura, largura, profundidade, peso } = req.body;
    req.session.produto = { 
        ...req.session.produto, 
        rua: parseInt(rua), 
        coluna: parseInt(coluna), 
        andar: parseInt(andar), 
        altura: parseFloat(altura), 
        largura: parseFloat(largura), 
        profundidade: parseFloat(profundidade), 
        peso: parseFloat(peso) 
    };
    res.redirect('/cadastro/cadastro5');
});

// Tela 5 - Cadastro 5
router.get('/cadastro5', (req, res) => {
    res.render('cadastro5');
});

router.post('/cadastro5', upload.single('imagem'), async (req, res) => {
    const { descricaoTecnica } = req.body;
    const imagem = req.file ? req.file.buffer : null;
    const produtoCompleto = { 
        ...req.session.produto, 
        descricaoTecnica, 
        imagem, 
        inseridoPor: usuarioLogado.tipo === 'professor' ? SNProfessor : usuarioLogado.email,
    };

    // Salvar no banco de dados
    try {
        const db = require('../db'); // Assumindo que você tem um módulo db configurado
        await db.query(
            `INSERT INTO DimProduto (
                NOME_BASICO, NOME_MODIFICADOR, DESCRICAO_TECNICA, FABRICANTE,
                OBSERVACOES_ADICIONAL, IMAGEM, UNIDADE, PRECO_DE_VENDA, FRAGILIDADE,
                RUA, COLUNA, ANDAR, ALTURA, LARGURA, PROFUNDIDADE, PESO, inserido_por
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                produtoCompleto.nomeBasico,
                produtoCompleto.nomeModificador,
                produtoCompleto.descricaoTecnica,
                produtoCompleto.fabricante,
                produtoCompleto.observacoesAdicional,
                produtoCompleto.imagem,
                produtoCompleto.unidade,
                produtoCompleto.precoDeVenda,
                produtoCompleto.fragilidade,
                produtoCompleto.rua,
                produtoCompleto.coluna,
                produtoCompleto.andar,
                produtoCompleto.altura,
                produtoCompleto.largura,
                produtoCompleto.profundidade,
                produtoCompleto.peso,
                produtoCompleto.inserido_por
            ]
        );

        res.send('Produto cadastrado com sucesso!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar produto.');
    }
});

module.exports = router;
