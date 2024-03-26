const { verifyToken } = require('../VerifyToken')

const User = require('../models/userModel')

const addUser = async(req, res) => {
    const { login, password } = req.body;

    try {
        await User.addUser(login, password);
        res.status(201).json({ message: "Użytkownik został dodany." })
    } catch (error) {
        console.error("Błąd podczas dodawania użytkownika: ", error);
        res.status(500).json({ message: "Wystąpił błąd podczas dodawania użytkownika."})
    }
};

const loginUser = async(req, res) => {
    const { login, password } = req.body

    try {
        const token = await User.loginUser(login, password);
        if (token) {
            res.cookie("token", token, {
                httpOnly: false,
                maxAge: 3600 * 1000,
                secure: false
            });
            return res.redirect("/user-profile");
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
            console.log("udane?")
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
        const userData = await getUserDataFromDB();
    } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika. ", error)
        res.status(500).json({ message: "Błąd kontrolera" })
    }
}

module.exports = { addUser, loginUser, logoutUser, getToken, getUserData } 