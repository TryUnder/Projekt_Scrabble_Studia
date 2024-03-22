const User = require('../models/User')

exports.addUser = async(req, res) => {
    const { login, password } = req.body;

    try {
        await User.addUser(login, password);
        res.status(201).json({ message: "Użytkownik został dodany." })
    } catch (error) {
        console.error("Błąd podczas dodawania użytkownika: ", error);
        res.status(500).json({ message: "Wystąpił błąd podczas dodawania użytkownika."})
    }
};