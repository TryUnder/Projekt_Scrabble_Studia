const mariadb = require('mariadb')

    const pool = mariadb.createPool({
        host: 'localhost',
        user: 'root',
        password: 'ProjektScrabble',
        database: 'projekt_scrabble',
        connectionLimit: 5
    })

module.exports = pool;