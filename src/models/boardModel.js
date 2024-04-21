const pool = require('../utils/db.js')

const verifyWords = async(words) => {
    try {
        const conn = await pool.getConnection();
        words.array.forEach(async (word) => {
            const wordInfo = await conn.query("SELECT word FROM words WHERE word LIKE (?)", word)
        });
    } catch (error) {

    }
}

module.exports = { verifyWords }