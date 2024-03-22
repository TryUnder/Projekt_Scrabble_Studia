const pool = require('../utils/db.js')
const bcrypt = require('bcrypt')

const addUser = async (login, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const conn = await pool.getConnection();
        const rows = await conn.query("INSERT INTO user (login, password, CreationDate, LiczbaRozegranychPartii, UkonczoneGry, WygraneGry, PrzegraneGry) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [login, hashedPassword, new Date(), 0, 0, 0, 0])
        conn.release()
        return rows;
    } catch (error) {
        console.error("Błąd podczas dodawania użytkownika: ", error)
        throw error;
    }
};

module.exports = { addUser }; 