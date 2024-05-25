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

const initializeLetterMap = () => {
    try {
        const myLetterMap = new Map(Object.entries({
            ' ': { count: 2, points: 0 },

            'A': { count: 9, points: 1 },
            'E': { count: 7, points: 1 },
            'I': { count: 8, points: 1 },
            'N': { count: 5, points: 1 },
            'O': { count: 6, points: 1 },
            'R': { count: 4, points: 1 },
            'S': { count: 4, points: 1 },
            'W': { count: 4, points: 1 },
            'Z': { count: 5, points: 1 },

            // 'C': { count: 3, points: 2 },
            // 'D': { count: 3, points: 2 },
            // 'K': { count: 3, points: 2 },
            // 'L': { count: 3, points: 2 },
            // 'M': { count: 3, points: 2 },
            // 'P': { count: 3, points: 2 },
            // 'T': { count: 3, points: 2 },
            // 'Y': { count: 4, points: 2 },

            // 'B': { count: 2, points: 3 },
            // 'G': { count: 2, points: 3 },
            // 'H': { count: 2, points: 3 },
            // 'J': { count: 2, points: 3 },
            // 'Ł': { count: 2, points: 3 },
            // 'U': { count: 2, points: 3 },

            // 'Ą': { count: 1, points: 5 },
            // 'Ę': { count: 1, points: 5 },
            // 'F': { count: 1, points: 5 },
            // 'Ó': { count: 1, points: 5 },
            // 'Ś': { count: 1, points: 5 },
            // 'Ż': { count: 1, points: 5 },

            // 'Ć': { count: 1, points: 6 },
            // 'Ń': { count: 1, points: 7 },
            // 'Ź': { count: 1, points: 9 },
        }));

        return myLetterMap;
    } catch (error) {
        console.error("Błąd przy generowaniu mapy liter", error)
    }
}

module.exports = { verifyWords, initializeLetterMap }