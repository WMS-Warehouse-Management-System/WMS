const sql = require('mssql');

const dbConfig = {
    user: 'carlosBD',
    password: '1234',
    server: '127.0.0.1',
    database: 'WMS',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Conexão com o banco de dados estabelecida.');
        return pool;
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco:', err);
    });

module.exports = poolPromise;
