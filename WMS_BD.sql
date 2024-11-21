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

select * from DimProduto