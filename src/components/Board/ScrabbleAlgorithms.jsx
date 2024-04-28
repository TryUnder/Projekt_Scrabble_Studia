import React from 'react'
import axios from 'axios'

export const sendWordsToServer = async (words) => {
    try {
        const response = await axios.post("/api/checkWords", words)
        const responseData = response.data
        console.log("response: ", responseData)
        return responseData
    } catch (error) {
        console.error("Błąd podczas wysyłania words na serwer: ", error)
    }
}

export const checkNeighbourhood = (words, boardData) => {
    // Pobieramy współrzędne już zaakceptowanych liter
    const acceptedCoords = [];
    boardData.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col.isAccepted) {
                acceptedCoords.push([colIndex, rowIndex]);
            }
        });
    });

    // Iterujemy przez nowo ułożone litery
    const allNeighbours = words.every(word => {
        const lettersCoords = [];

        // Pobieramy współrzędne nowo ułożonych liter
        boardData.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (col.letter.value !== '' && word.includes(col.letter.value)) {
                    lettersCoords.push([colIndex, rowIndex]);
                }
            });
        });

        // Sprawdzamy czy współrzędne nowo ułożonych liter sąsiadują z zaakceptowanymi współrzędnymi
        return lettersCoords.some(coord => {
            return acceptedCoords.some(acceptedCoord => {
                const [x1, y1] = coord;
                const [x2, y2] = acceptedCoord;
                // Sprawdzamy czy współrzędne różnią się tylko o jeden na osi x lub y, czyli sąsiadują tylko poziomo lub pionowo
                return (Math.abs(x1 - x2) === 1 && y1 === y2) || (x1 === x2 && Math.abs(y1 - y2) === 1);
            });
        });
    });

    if (allNeighbours === true) {
        console.log("true")
        return true
    } else {
        console.log("false")
        return false
    }
};

export const findWords = (boardData, isAccepted = false) => {
    const words = [];
    boardData.map((row, x) => {
        let word = '';
        row.map((column, y) => {
            const tile = boardData[x][y]
            if (tile.letter.value !== '') {
                if (isAccepted && tile.isAccepted) {
                    word += tile.letter.value
                } else if (isAccepted === false) {
                    word += tile.letter.value;
                }
            } else {
                if (word.length > 1) {
                    words.push(word);
                }
                word = '';
            }
        })
    })

    boardData.map((row, x) => {
        let word = '';
        row.map((column, y) => {
            const tile = boardData[y][x]
            if (tile.letter.value !== '') {
                if (isAccepted && tile.isAccepted) {
                    word += tile.letter.value
                } else if (isAccepted === false) {
                    word += tile.letter.value;
                }
            } else {
                if (word.length > 1) {
                    words.push(word);
                }
                word = '';
            }
        })
    })

    boardData.forEach((row, x) => {
        row.forEach((column, y) => {
            const tile = boardData[x][y];
            if (tile.letter.value !== '') {
                let hasNeighbor = false; // Flaga określająca, czy litera ma sąsiada
                // Sprawdzanie sąsiadów w kierunku górnym
                if (x > 0 && boardData[x - 1][y].letter.value !== '') {
                    hasNeighbor = true;
                }
                // Sprawdzanie sąsiadów w kierunku dolnym
                if (x < boardData.length - 1 && boardData[x + 1][y].letter.value !== '') {
                    hasNeighbor = true;
                }
                // Sprawdzanie sąsiadów w kierunku lewym
                if (y > 0 && boardData[x][y - 1].letter.value !== '') {
                    hasNeighbor = true;
                }
                // Sprawdzanie sąsiadów w kierunku prawym
                if (y < row.length - 1 && boardData[x][y + 1].letter.value !== '') {
                    hasNeighbor = true;
                }
                if (!hasNeighbor) {
                    // Jeśli litera nie ma żadnych sąsiadów, dodaj ją do tablicy oneLetter
                    words.push(tile.letter.value);
                }
            }
        });
    });

    if (boardData[7][7].letter.value !== '') {
        return words
    } else {
        alert("Słowo musi przechodzić przez środek planszy!")
        return
    }
}

export const filterWords = (words, isAcc) => {
    const result = [];

    for (const word of words) {
        let isDifferent = true;

        for (const accWord of isAcc) {
            let differences = 0;

            for (let i = 0; i < word.length; i++) {
                if (word[i] !== accWord[i]) {
                    differences++;
                }
            }

            if (differences <= 1) {
                isDifferent = false;
                break;
            }
        }

        if (isDifferent) {
            result.push(word);
        }
    }

    return result;
};

const words = ["KRAM", "NAĆ"];
const isAcc = ["KRA", "NAĆ"];

