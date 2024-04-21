const Board = require('../models/boardModel')
const { verifyToken } = require('../VerifyToken')

const checkWords = async (req, res) => {
    try {
        verifyToken(req, res, async() => {
            const words = req.body
            console.log("WORDSY: ", words)
            const verifiedWords = await Board.verifyWords(words)
            res.status(200).json(verifiedWords)
        })
    } catch (error) {
        console.error("Błąd podczas obsługi w kontrolerze słów", error)
        res.status(500).json( { message: "Błąd kontrolera" })
    }
}

module.exports = { checkWords }