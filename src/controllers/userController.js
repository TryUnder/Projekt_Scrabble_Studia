const { verifyToken } = require('../VerifyToken')
const { emitLoggedInUser } = require('../server/webSocketService')
const io = require('socket.io-client')

const User = require('../models/userModel')

const addUser = async(req, res) => {
    const { login, password } = req.body;

    try {
        const user = await User.addUser(login, password);
        if (user) {
            res.status(201).json({ message: "Użytkownik został dodany." })
        } else {
            res.status(409).json({ message: "Użytkownik istnieje już w bazie danych." })
        }
    } catch (error) {
        console.error("Błąd podczas dodawania użytkownika: ", error);
        res.status(500).json({ message: "Wystąpił błąd podczas dodawania użytkownika."})
    }
};

const loginUser = async(req, res) => {
    const { login, password } = req.body

    try {
        const user = await User.loginUser(login, password);
        if (user && user.userToken) {
            res.cookie("token", user.userToken, {
                httpOnly: false,
                maxAge: 3600 * 1000 * 2,
                secure: false
            });
            res.cookie("id", user.userId, {
                httpOnly: false,
                maxAge: 3600 * 1000 * 2,
                secure: false
            });
            
            if (user.userLogin) {
                const socket = io('http://localhost:3000')
                socket.emit('userLogin', user.userLogin)
            }

            return res.redirect("/user-profile");
        } else {
            res.status(401).json({ message: "Błędny login lub hasło. " })
        }

    } catch (error) {
        console.error("Błąd podczas logowania użytkownika: ", error)
        res.status(500).json({ message: "Wystąpił błąd podczas logowania użytkownika" })
    }
}

const logoutUser = async(req, res) => {
    try {
        verifyToken(req, res, async () => {
            res.clearCookie('token', {httpOnly: false, value: 'token'});
            res.clearCookie('id')
            res.status(200).json({ message: "użytkownik został pomyślnie wylogowany. "})
        });
    } catch (error) {
        console.error("Błąd podczas wylogowywania użytkownika", error)
        res.status(500).json({ message: "błąd" })
    }
}

const getToken = async (req, res) => {
    try {
        verifyToken(req, res, async() => {
            res.status(200).json({ valid: true })
        })
    } catch (error) {
        console.error("Błąd podczas weryfikacji tokenu. ", error)
        res.status(401).json({ valid: false, message: "Wystąpił błąd podczas weryfikacji tokenu. "})
    }
}

const getUserData = async (req, res) => {
    try {
        verifyToken(req, res, async() => {
            const userId = req.query.userId;
            const userData = await User.getUserDataFromDB(userId);
            res.status(200).json(userData)
        })
    } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika. ", error)
        res.status(500).json({ message: "Błąd kontrolera" })
    }
}

const updateStatistics = async (req, res) => {
    try {
        verifyToken(req, res, async() => {
            const playerLogin = req.body.playerName;
            const infoMatch = req.body.info;
            await User.updateStatistics(playerLogin, infoMatch);
            res.status(200).json({ message: "Statystyki zostały zaktualizowane." })
        })
    } catch (error) {
        console.error("Błąd podczas aktualizacji statystyk w kontrolerze. ", error)
        res.status(500).json({ message: "Błąd kontrolera" })
    }
}

module.exports = { addUser, loginUser, logoutUser, getToken, getUserData, updateStatistics } 