const pool = require('../utils/db.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

const addUser = async (login, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const conn = await pool.getConnection();
        const dbLogins = await conn.query("SELECT login FROM user");
        const loginExists = dbLogins.some(dbLogin => dbLogin.login === login);
        if (loginExists) {
            return null;
        }
        const rows = await conn.query("INSERT INTO user (login, password, CreationDate, LiczbaRozegranychPartii, ZremisowaneGry, WygraneGry, PrzegraneGry) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [login, hashedPassword, new Date(), 0, 0, 0, 0])
        conn.release()
        return rows;
    } catch (error) {
        console.error("Błąd podczas dodawania użytkownika: ", error)
        throw error;
    }
};

const loginUser = async (login, plainTextPassword) => {
    try {
        const conn = await pool.getConnection();
        const hashedPassword = await conn.query("SELECT password FROM user WHERE login = (?)", login)
        
        const passwordMatch = await bcrypt.compare(plainTextPassword, hashedPassword.map(e => e.password).toString())

        if (!(login && passwordMatch)) {
            return null;
        }

        const id = await conn.query("SELECT id FROM user WHERE login = (?)", login)
        
        const token = jwt.sign( { login }, process.env.JWT_SECRET, {
            expiresIn: 7200
        });

        const user = {
            userId: id,
            userToken: token,
            userLogin: login
        }

        conn.release()
        return user;

    } catch (error) {
        console.error("Błąd podczas logowania użytkownika", error)
        res.status(500).json({ message: "Wystąpił błąd podczas logowania użytkownika" })
    }
}

const getUserDataFromDB = async(id) => {
    try {
        const conn = await pool.getConnection();
        const userInfo = await conn.query("SELECT Login, CreationDate, LiczbaRozegranychPartii, ZremisowaneGry, WygraneGry, PrzegraneGry FROM user WHERE id = (?)", id);
        conn.release()
        return userInfo;
    } catch (error) {
        console.error("Błąd podczas pobierania danych o użytkowniku z bazy danych.")
    }
}

const updateStatistics = async(playerLogin, infoMatch) => {
    try {
        const conn = await pool.getConnection();
        if (infoMatch === "win") {
            await conn.query("UPDATE user SET LiczbaRozegranychPartii = LiczbaRozegranychPartii + 1, WygraneGry = WygraneGry + 1 WHERE login = (?)", playerLogin)
        } else if (infoMatch === "lose") {
            await conn.query("UPDATE user SET LiczbaRozegranychPartii = LiczbaRozegranychPartii + 1, PrzegraneGry = PrzegraneGry + 1 WHERE login = (?)", playerLogin)
        } else if (infoMatch === "draw") {
            await conn.query("UPDATE user SET LiczbaRozegranychPartii = LiczbaRozegranychPartii + 1, ZremisowaneGry = ZremisowaneGry + 1 WHERE login = (?)", playerLogin)
        }
    } catch (error) {
        console.error("Błąd podczas aktualizacji statystyk gracza w modelu. ", error)
    }
}

module.exports = { addUser, loginUser, getUserDataFromDB, updateStatistics }; 