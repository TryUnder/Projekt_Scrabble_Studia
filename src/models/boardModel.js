const pool = require('../utils/db.js')

const verifyWords = async(words) => {
    try {
        const conn = await pool.getConnection();
        const queries = await words.map(word => conn.query("SELECT slowo FROM slownikpl WHERE slowo LIKE (?)", word))
        const resultResponseQuery = await Promise.all(queries)
        const allWordsExist = resultResponseQuery.every(result => result.length > 0);
        console.log(allWordsExist)
        conn.end()
        return allWordsExist
    } catch (error) {
        console.error("Błąd przy obsłudze bazy danych podczas wyszukiwania wyrazów w DB", error)
    }
}

module.exports = { verifyWords }