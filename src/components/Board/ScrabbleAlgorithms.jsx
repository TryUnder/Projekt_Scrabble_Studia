import React from 'react'
import axios from 'axios'
import ScoreBoard from './ScoreBoard'

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
    const acceptedCoords = [];
    boardData.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col.isAccepted) {
                acceptedCoords.push([colIndex, rowIndex]);
            }
        });
    });

    const allNeighbours = words.every(word => {
        const lettersCoords = [];

        boardData.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (col.letter.value !== '' && word.includes(col.letter.value)) {
                    lettersCoords.push([colIndex, rowIndex]);
                }
            });
        });

        return lettersCoords.some(coord => {
            return acceptedCoords.some(acceptedCoord => {
                const [x1, y1] = coord;
                const [x2, y2] = acceptedCoord;
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
                    wordObjArray.push([...letterObj]);
                    console.log("PUSHOWANE")
                }
                word = '';
                letterObj = []
            }
        })
        if (word.length > 1) {
            words.push(word)
            wordObjArray.push([...letterObj]);
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
                    wordObjArray.push([...letterObj]);
                }
                word = '';
                letterObj = []
            }
        })
        if (word.length > 1) {
            words.push(word)
            wordObjArray.push([...letterObj]);
        }
    })

    boardData.forEach((row, x) => {
        row.forEach((column, y) => {
            const tile = boardData[x][y];
            let letterObj = []
            if (tile.letter.value !== '') {
                let hasNeighbor = false;

                if (x > 0 && boardData[x - 1][y].letter.value !== '') {
                    hasNeighbor = true;
                }

                if (x < boardData.length - 1 && boardData[x + 1][y].letter.value !== '') {
                    hasNeighbor = true;
                }

                if (y > 0 && boardData[x][y - 1].letter.value !== '') {
                    hasNeighbor = true;
                }

                if (y < row.length - 1 && boardData[x][y + 1].letter.value !== '') {
                    hasNeighbor = true;
                }
                if (!hasNeighbor) {
                    words.push(tile.letter.value);
                    letterObj = letterObj.concat({ letter: tile.letter.value, x: tile.x, y: tile.y })
                    wordObjArray.push([...letterObj]);
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

export const filterWords = (wordObjArray, wordObjAcceptedArray) => {
    const wordObjArrayFull = wordObjArray.map(wordArray =>
        wordArray.map(word => ({ x: word.y, y: word.x, letter: word.letter }))
    );
    const wordObjAcceptedArrayFull = wordObjAcceptedArray.flatMap(wordArray =>
        wordArray.map(word => ({ x: word.y, y: word.x }))
    );

    const wordsCoordsArray = wordObjArrayFull.filter(wordArray =>
        !wordArray.every(word =>
            wordObjAcceptedArrayFull.some(acceptedWord =>
                acceptedWord.x === word.x && acceptedWord.y === word.y
            )
        )
    );
        
    console.log("WordObjArrayFull: ", wordObjArrayFull);
    console.log("WordObjAcceptedArrayFull: ", wordObjAcceptedArrayFull);
    console.log("Result array: ", wordsCoordsArray);
    const filteredWords = []
    wordsCoordsArray.forEach(e => {
        filteredWords.push(e.flatMap(letterObj => letterObj.letter).join(''))
    });
    console.log("filteredWords: ", filteredWords)

    return { filteredWords, wordsCoordsArray }
};

export const calculatePoints = (wordsCoordsArray, boardData, letterMap) => {
    console.log("wca", "bca")
    console.log(wordsCoordsArray)
    console.log(boardData)

    const getLetterPoints = (letter, letterMap) => {
        return letterMap.get(letter).points
    }

    const getLetterBonuses = (x, y, boardData) => {
        const tileClass = boardData[x][y].tile
        switch(tileClass) {
            case 'DL': {
                return 2;
            }
            case 'TL': {
                return 3;
            }
            default: {
                return 1;
            }
        }
    }

    const getWordBonuses = (x, y, boardData) => {
        const tileClass = boardData[x][y].tile
        switch(tileClass) {
            case 'DW': {
                return 2;
            }
            case 'TW': {
                return 3;
            }
            default: {
                return 1;
            }
        }
    }
    let wordsSum = 0;
    wordsCoordsArray.map((word, wordIndex) => {
        console.log("xx: ", word)
        let wordSum = 0
        let multiplier = 1;
        word.map((letterObj, letterIndex) => {
            console.log("letter: ", letterObj.letter, " point: ", getLetterPoints(letterObj.letter, letterMap))
            wordSum += (getLetterPoints(letterObj.letter, letterMap) * getLetterBonuses(letterObj.x, letterObj.y, boardData))
            console.log("letterIndex: ", letterIndex, " word.length: ", word.length)
            multiplier *= getWordBonuses(letterObj.x, letterObj.y, boardData)
            if (letterIndex === word.length - 1) {
                wordSum *= multiplier;
                console.log("Word Sum: ", wordSum)
                wordsSum += wordSum;
            }
        })
    })
    console.log("words Sum: ", wordsSum)
    updatePointsNumber(wordsSum)
}