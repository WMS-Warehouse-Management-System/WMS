	use master
	go
	drop database wms
	go

	CREATE DATABASE WMS
	GO
 
	 USE wms
	 GO 
	-- Tabela: DIM_USUARIO
	CREATE TABLE DimUsuario (
		IDUsuario int primary key identity,
		EMAIL NVARCHAR(255) not null,
		NOME NVARCHAR(255) NOT NULL,
		SENHA NVARCHAR(255) NOT NULL,
		DATANASC DATE,
		DATAENTRADA DATE
	);

	-- Tabela: FACT_ADICIONAR
	CREATE TABLE FactAdicionar (
		IDAdicionar BIGINT PRIMARY KEY IDENTITY(1,1),
		IDUsuario int NOT NULL,
		SN BIGINT NOT NULL
	);

	-- Tabela: DIM_PROFESSOR
	CREATE TABLE DimProfessor (
		SN BIGINT PRIMARY KEY,
		NOME NVARCHAR(255) NOT NULL,
		SENHA NVARCHAR(255) NOT NULL
	);



	-- Tabela: DIM_PRODUTO
	CREATE TABLE DimProduto (
		CODIGO BIGINT PRIMARY KEY,
		NOME_BASICO NVARCHAR(255) NOT NULL,
		NOME_MODIFICADOR NVARCHAR(255),
		DESCRICAO_TECNICA NVARCHAR(MAX),
		PRECO_DE_AQUISICAO DECIMAL(10, 2),
		FABRICANTE NVARCHAR(255),
		FORNECEDOR NVARCHAR(255),
		ENDERECAMENTO NVARCHAR(255),
		VALIDADE DATE,
		OBSERVACOES_ADICIONAL NVARCHAR(MAX),
		IMAGEM VARBINARY(MAX),
		UNIDADE NVARCHAR(50),
		PRECO_DE_VENDA DECIMAL(10, 2),
		FRAGILIDADE BIT,
		inserido_por nvarchar(255) not null
	);

	-- Tabela: FACT_CATEGORIA
	CREATE TABLE FactCategoria (
		IDCategoriaProduto BIGINT PRIMARY KEY IDENTITY(1,1),
		CODIGO BIGINT NOT NULL,
		IDCategoria BIGINT NOT NULL
	);

	CREATE TABLE DimCategoria (
		IDCategoria BIGINT PRIMARY KEY IDENTITY(1,1),
		CATEGORIA NVARCHAR(255) NOT NULL
	);

	-- Tabela: RECEBIMENTO
	CREATE TABLE FactRecebimento (
		IDRecebimento BIGINT PRIMARY KEY IDENTITY(1,1),
		DATA_RECEB DATE NOT NULL,
		QUANT BIGINT NOT NULL,
		CODIGO BIGINT NOT NULL
	);

	go 
	CREATE TABLE LoginsAtivos (
		id INT PRIMARY KEY IDENTITY(1,1),
		usuarioEmail NVARCHAR(255) NOT NULL,
		loginTimestamp DATETIME NOT NULL DEFAULT GETDATE(),
		logoutTimestamp DATETIME NULL
	);
	go

	ALTER TABLE FactAdicionar
	ADD CONSTRAINT FK_Adicionar_Usuario FOREIGN KEY (SN)
	REFERENCES DimProfessor(SN);
	go 

	ALTER TABLE FactAdicionar
	ADD CONSTRAINT FK2_Adicionar_Usuario FOREIGN KEY (IDUsuario)
	REFERENCES DimUsuario(IDUsuario);
	go 

	-----PRODUTO E SUA CATEGORIA



	ALTER TABLE FactCategoria
	ADD CONSTRAINT FK_Categoria_Produto  FOREIGN KEY (CODIGO)
	REFERENCES DimProduto(CODIGO);
	go 
	ALTER TABLE FactCategoria
	ADD CONSTRAINT FK2_Categoria_Produto  FOREIGN KEY (IDCategoria)
	REFERENCES DimCategoria(IDCategoria);
	go

	--Recebimento de prod

	ALTER TABLE FactRecebimento
	ADD CONSTRAINT FK_Recebimento_Produto  FOREIGN KEY (CODIGO)
	REFERENCES DimProduto(CODIGO);

	go

	ALTER TABLE DimProduto
	DROP COLUMN VALIDADE;

	go
	-- Ajuste na tabela de recebimento
	ALTER TABLE FactRecebimento
	ADD VALIDADE DATE NOT NULL;

	ALTER TABLE DimProduto
	DROP COLUMN PRECO_DE_AQUISICAO;

	go
	-- Ajuste na tabela de recebimento
	ALTER TABLE FactRecebimento
	ADD PRECO_DE_AQUISICAO DECIMAL(10, 2) not null;
	go

	ALTER TABLE FactRecebimento
	ADD LOTE Nvarchar(30) not null;
	go
	ALTER TABLE DimProfessor
	ADD EMAIL nvarchar(255) not null;
	go
	insert into DimProfessor(SN,NOME,SENHA,EMAIL)
	values(222,'carlos','1234','carlos@professor.com')
	go 

	select * from DimCategoria
	insert into DimCategoria(CATEGORIA)
	values ('escritorio'),
	('armazem')
	go

	-- Ajustando a Tabela dos Produtos
 
	ALTER TABLE DimProduto
	DROP COLUMN ENDERECAMENTO
	GO

	ALTER TABLE DimProduto
	ADD RUA INT, COLUNA INT, ANDAR INT, ALTURA FLOAT, LARGURA FLOAT, PROFUNDIDADE FLOAT, PESO FLOAT
	GO

	-- Trocando a coluna fornecedor de DimProduto para 

	ALTER TABLE DimProduto
	DROP COLUMN FORNECEDOR
	GO

	ALTER TABLE FactRecebimento
	ADD FORNECEDOR VARCHAR(255)
	GO

	--Inserindo dados a tabela DimProduto

	INSERT INTO DimProduto (
    CODIGO, 
    NOME_BASICO, 
    NOME_MODIFICADOR, 
    DESCRICAO_TECNICA, 
    FABRICANTE, 
    OBSERVACOES_ADICIONAL, 
    IMAGEM, 
    UNIDADE, 
    PRECO_DE_VENDA, 
    FRAGILIDADE, 
    inserido_por, 
    RUA, 
    COLUNA, 
    ANDAR, 
    ALTURA, 
    LARGURA, 
    PROFUNDIDADE, 
    PESO
)
VALUES
(1, 'Produto A', 'Modificador X', 'Descrição Técnica 1', 'Fabricante 1', 'Observação 1', NULL, 'Unidade A', 10.50, 1, 'Usuario1', 1, 1, 1, 10, 20, 15, 10.5),
(2, 'Produto B', 'Modificador Y', 'Descrição Técnica 2', 'Fabricante 2', 'Observação 2', NULL, 'Unidade B', 20.99, 0, 'Usuario2', 2, 2, 2, 15, 25, 10, 2.4),
(3, 'Produto C', 'Modificador Z', 'Descrição Técnica 3', 'Fabricante 3', 'Observação 3', NULL, 'Unidade C', 30.00, 1, 'Usuario3', 3, 3, 3, 20, 30, 20, 0.3),
(4, 'Produto D', 'Modificador W', 'Descrição Técnica 4', 'Fabricante 4', 'Observação 4', NULL, 'Unidade D', 40.50, 1, 'Usuario4', 4, 4, 2, 25, 35, 25, 0.8),
(5, 'Produto E', 'Modificador V', 'Descrição Técnica 5', 'Fabricante 5', 'Observação 5', NULL, 'Unidade E', 50.99, 0, 'Usuario5', 1, 1, 5, 30, 40, 30, 20);

GO