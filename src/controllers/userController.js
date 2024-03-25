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
                httpOnly: false
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
            console.log("udane?")
        });
    } catch (error) {
        console.error("Błąd podczas wylogowywania użytkownika", error)
        res.status(500).json({ message: "błąd" })
    }
}

module.exports = { addUser, loginUser, logoutUser } 