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
        const rows = await conn.query("INSERT INTO user (login, password, CreationDate, LiczbaRozegranychPartii, UkonczoneGry, WygraneGry, PrzegraneGry) VALUES (?, ?, ?, ?, ?, ?, ?)",
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

        if (passwordMatch) {
            console.log("Hasło poprawne.")
        } else {
            console.log("Hasło błędne.")
        }

        if (!(login && passwordMatch)) {
            console.log("Błędne dane")
            return null;
        }

        const id = await conn.query("SELECT id FROM user WHERE login = (?)", login)
        
        const token = jwt.sign( { login }, process.env.JWT_SECRET, {
            expiresIn: 3600
        });

        const user = {
            userId: id,
            userToken: token,
            userLogin: login
        }
        return user;

    } catch (error) {
        console.error("Błąd podczas logowania użytkownika", error)
    }
}

const getUserDataFromDB = async(id) => {
    try {
        const conn = await pool.getConnection();
        const userInfo = await conn.query("SELECT Login, CreationDate, LiczbaRozegranychPartii, UkonczoneGry, WygraneGry, PrzegraneGry FROM user WHERE id = (?)", id);
        return userInfo;
    } catch (error) {
        console.error("Błąd podczas pobierania danych o użytkowniku z bazy danych.")
        //throw error;
    }
}

module.exports = { addUser, loginUser, getUserDataFromDB }; 