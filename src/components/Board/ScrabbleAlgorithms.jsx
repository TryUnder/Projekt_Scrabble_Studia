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
        return true
    } else {
        return false
    }
};

export const findWords = (boardData, isAccepted = false) => {
    const words = [];
    let wordObjArray = []

    boardData.map((row, x) => {
        let word = '';
        let letterObj = []
        row.map((column, y) => {
            const tile = boardData[x][y]
            if (tile.letter.value !== '') {
                if (isAccepted && tile.isAccepted) {
                    console.log("WORD: ", word)
                    word += tile.letter.value
                    letterObj.push({ letter: tile.letter.value, x: tile.x, y: tile.y });
                } else if (isAccepted === false) {
                    word += tile.letter.value;
                    letterObj.push({ letter: tile.letter.value, x: tile.x, y: tile.y });
                }
            } else {
                if (word.length > 1) {
                    words.push(word);
                    wordObjArray.push(new Array([...letterObj]));
                    console.log("PUSHOWANE")
                }
                word = '';
                letterObj = []
            }
        })
        if (word.length > 1) {
            words.push(word)
            wordObjArray.push(new Array([...letterObj]));
        }
    })

    boardData.map((row, x) => {
        let word = ''
        let letterObj = []
        row.map((column, y) => {
            const tile = boardData[y][x]
            if (tile.letter.value !== '') {
                if (isAccepted && tile.isAccepted) {
                    word += tile.letter.value
                    letterObj.push({ letter: tile.letter.value, x: tile.x, y: tile.y });
                } else if (isAccepted === false) {
                    word += tile.letter.value;
                    letterObj.push({ letter: tile.letter.value, x: tile.x, y: tile.y });
                }
            } else {
                if (word.length > 1) {
                    words.push(word);
                    wordObjArray.push(new Array([...letterObj]));
                }
                word = '';
                letterObj = []
            }
        })
        if (word.length > 1) {
            words.push(word)
            wordObjArray.push(new Array([...letterObj]));
        }
    })

    boardData.forEach((row, x) => {
        row.forEach((column, y) => {
            const tile = boardData[x][y];
            let letterObj = []
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
                    letterObj = letterObj.concat({ letter: tile.letter.value, x: tile.x, y: tile.y })
                    wordObjArray.push(new Array([...letterObj]));
                }
            }
        });
    });

    if (boardData[7][7].letter.value !== '') {
        if (isAccepted) {
            const isAcceptedWords = [...words]
            const wordObjAcceptedArray = [...wordObjArray]
            return { isAcceptedWords, wordObjAcceptedArray }
        } else {
            return { words, wordObjArray }
        }
    } else {
        alert("Słowo musi przechodzić przez środek planszy!")
        return
    }
}

export const filterWords = (words, isAcc, wordObjArray, wordObjAcceptedArray) => {
    const result = [];
    console.log("WORDS: ", words)
    console.log("ACC OPTIMA: ", isAcc)
    for (let word of words) {
        let isDifferent = true;
        console.log("for(1) word: ", word)

        for (let accWord of isAcc) {
            let differences = 0;
            console.log("for(2) accWord: ", accWord)

            for (let i = 0; i < word.length; i++) {
                while(word.length < accWord.length) {
                    word = word.concat(' ')
                }
                while(accWord.length < word.length) {
                    accWord = accWord.concat(' ')
                }
                console.log("word[i]: ", word, " accWord[i]: ", accWord)
                if (word[i] !== accWord[i]) {
                    differences++;
                }
            }

            if (differences === 0) {
                for (let word of wordObjArray.flat()) {
                    for (let accWord of wordObjAcceptedArray.flat()) {
                        for (let i = 0; i < accWord.length; i++) {
                            for (let j = 0; j < word.length; j++) {
                                console.log("*****")
                                console.log(word[i].letter)
                                console.log(accWord[i].letter)
                                console.log("*****")
                                if (word[i].letter === accWord[i].letter && word[i].x !== accWord[i].x
                                    && word[i].y !== accWord[i].y) {
                                        console.log("znaleziono wyrazy")
                                    }
                            }
                        }
                    }
                }
                isDifferent = false;
                break;
            }
        }

        if (isDifferent) {
            const newWord = word.trim()
            result.push(newWord);
            console.log("WORD: ", newWord, " result: ", result)
        }
    }

    return result;
};