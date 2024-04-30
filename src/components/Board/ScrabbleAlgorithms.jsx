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

export const filterWords2 = (wordObjArray, wordObjAcceptedArray) => {
    const wordObjArrayFull = wordObjArray.map(wordArray =>
        wordArray.map(word => ({ x: word.y, y: word.x }))
    );
    const wordObjAcceptedArrayFull = wordObjAcceptedArray.flatMap(wordArray =>
        wordArray.map(word => ({ x: word.y, y: word.x }))
    );

    const resultArray = wordObjArrayFull.filter(wordArray =>
        !wordArray.every(word =>
            wordObjAcceptedArrayFull.some(acceptedWord =>
                acceptedWord.x === word.x && acceptedWord.y === word.y
            )
        )
    );

    //console.log("otrzymane wspolrzedne", notAcceptedObjs); // Otrzymamy oczekiwany wynik
        
    console.log("WordObjArrayFull: ", wordObjArrayFull);
    console.log("WordObjAcceptedArrayFull: ", wordObjAcceptedArrayFull);
    console.log("Result array: ", resultArray);

}; 

export const filterWords = (words, isAcc, wordObjArray, wordObjAcceptedArray) => {
    const result = new Set();
    console.log("words: ", words)
    console.log("isAcc: ", isAcc)
    console.log("wordObjArray: ", wordObjArray)
    console.log("wordObjAcceptedArray: ", wordObjAcceptedArray)
    
    // Funkcja sprawdzająca, czy dane słowo istnieje w obu tablicach i różni się współrzędnymi
    const wordExistsWithDifferentCoords = (word) => {
        for (let wordObj2 of wordObjAcceptedArray) {
            const wordLetters2 = wordObj2.map(letterObj => letterObj.letter).join('');
                for (let wordObj1 of wordObjArray) {
                    const wordLetters1 = wordObj1.map(letterObj => letterObj.letter).join('');
                    if (wordLetters1 === wordLetters2) {
                        let coordsDiffer = false;
                        for (let i = 0; i < wordObj1.length; i++) {
                            console.log("wordObj1x: ", wordObj1[i].x, "wordObj1y: ", wordObj1[i].y)
                            console.log("wordObj2x: ", wordObj2[i].x, "wordObj2y: ", wordObj2[i].y)
                            if (wordObj1[i].x !== wordObj2[i].x || wordObj1[i].y !== wordObj2[i].y) {
                                coordsDiffer = true;
                                break;
                            }
                        }
                        if (coordsDiffer) {
                            return true;
                        }
                    }
                }
        }
    
        return false;
    };

    // const wordsPointsArray = () => {
    //     for (let word )
    // }
    

    // Iteracja po każdym słowie w words
    for (let word of words) {
        let isDifferent = true;

        // Iteracja po każdym słowie w isAcc
        for (let accWord of isAcc) {
            let differences = 0;

            // Dopasowanie długości słów
            while (word.length < accWord.length) {
                word = word.concat(' ')
            }
            while (accWord.length < word.length) {
                accWord = accWord.concat(' ')
            }

            // Porównywanie liter w słowach
            for (let i = 0; i < word.length; i++) {
                if (word[i] !== accWord[i]) {
                    differences++;
                }
            }

            // Jeśli słowa są identyczne, przerwij pętlę
            if (differences === 0) {
                const retx = wordExistsWithDifferentCoords(word)
                if (retx === true) {
                    result.add(word.trim())
                }
                isDifferent = false;
                break;
            }
        }

        if (isDifferent) {
            const newWord = word.trim()
            result.add(newWord);
            console.log("WORD: ", newWord, " result: ", result)
        }
    }
    const arrayRet = Array.from(result)
    return arrayRet;
};