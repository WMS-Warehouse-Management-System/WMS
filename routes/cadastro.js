const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuração do multer para upload de imagens
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB para imagens
});

// Middleware de validação de sessão
const verificarSessao = (req, res, next) => {
    if (!req.session.produto) {
        return res.status(400).send({ error: 'Sessão não iniciada. Volte para a etapa 1.' });
    }
    next();
};

// Rotas para cada etapa do cadastro
router.get('/cadastro1', (req, res) => res.render('cadastro1'));

router.post('/cadastro1', (req, res) => {
    const {codigo,nomeBasico, nomeModificador,descricaoTecnica } = req.body;
    if (!nomeBasico || !nomeModificador) {
        return res.status(400).send({ error: 'Preencha todos os campos obrigatórios.' });
    }
    req.session.produto = { codigo,nomeBasico, nomeModificador,descricaoTecnica };
    res.redirect('/cadastro/cadastro2');
});

router.get('/cadastro2', verificarSessao, (req, res) => res.render('cadastro2'));

router.post('/cadastro2', verificarSessao, (req, res) => {
    const { fabricante,fragilidade,unidade,precoVenda } = req.body;
    req.session.produto = { 
        ...req.session.produto, 
        fabricante, 
        unidade,
        precoVenda: parseFloat(precoVenda),
        fragilidade: fragilidade === 'on' ? 1 : 0 
    };


    res.redirect('/cadastro/cadastro3');
});

router.get('/cadastro3', verificarSessao, (req, res) => res.render('cadastro3'));

router.post('/cadastro3', verificarSessao, (req, res) => {


        const{rua,coluna,andar} = req.body;
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
    const {altura, largura, profundidade, peso } = req.body;
    req.session.produto = { 
        ...req.session.produto, 
        altura: parseFloat(altura), 
        largura: parseFloat(largura), 
        profundidade: parseFloat(profundidade), 
        peso: parseFloat(peso) 
    };
    res.redirect('/cadastro/cadastro5');
});

router.get('/cadastro5', verificarSessao, (req, res) => res.render('cadastro5'));

router.post('/cadastro5', verificarSessao, upload.single('imagem'), async (req, res) => {
    const { observacao } = req.body;
    const imagem = req.file ? req.file.buffer : null;

    try {
        const produtoCompleto = { 
            ...req.session.produto, 
            observacao, 
            imagem,
            inserido_por: req.session.usuarioLogado.tipo === 'professor' ? SNProfessor : usuarioLogado.email
        };

        const db = require('../app');
        await db.query(
            `INSERT INTO DimProduto (
                CODIGO,NOME_BASICO, NOME_MODIFICADOR, DESCRICAO_TECNICA, FABRICANTE,
                OBSERVACOES_ADICIONAL, UNIDADE, PRECO_DE_VENDA, FRAGILIDADE,
                RUA, COLUNA, ANDAR, ALTURA, LARGURA, PROFUNDIDADE, PESO, inserido_por
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                produtoCompleto.codigo,
                produtoCompleto.nomeBasico,
                produtoCompleto.nomeModificador,
                produtoCompleto.descricaoTecnica,
                produtoCompleto.fabricante,
                produtoCompleto.observacao,
                // produtoCompleto.imagem,
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
        
        req.session.produto = null;
        res.send({ message: 'Produto cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Erro ao cadastrar produto.' });
    }
});

module.exports = router;
