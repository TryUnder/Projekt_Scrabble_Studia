export const getTileClass = (type) => {
    switch (type) {
        case 'TW':
            return 'triple-word-score-tile'
            break;
        case 'DW':
            return 'double-word-score-tile'
            break;
        case 'TL':
            return 'triple-letter-score-tile'
            break;
        case 'DL':
            return 'double-letter-score-tile'
            break;
        default:
            return 'normal-tile'
            break;
    }
}

export const initializeLetterMap = () => {
    const myLetterMap = new Map(Object.entries({
        'Blank': { count: 2, points: 0 },

        'A': { count: 9, points: 1 },
        'E': { count: 7, points: 1 },
        'I': { count: 8, points: 1 },
        'N': { count: 5, points: 1 },
        'O': { count: 6, points: 1 },
        'R': { count: 4, points: 1 },
        'S': { count: 4, points: 1 },
        'W': { count: 4, points: 1 },
        'Z': { count: 5, points: 1 },

        'C': { count: 3, points: 2 },
        'D': { count: 3, points: 2 },
        'K': { count: 3, points: 2 },
        'L': { count: 3, points: 2 },
        'M': { count: 3, points: 2 },
        'P': { count: 3, points: 2 },
        'T': { count: 3, points: 2 },
        'Y': { count: 4, points: 2 },

        'B': { count: 2, points: 3 },
        'G': { count: 2, points: 3 },
        'H': { count: 2, points: 3 },
        'J': { count: 2, points: 3 },
        'Ł': { count: 2, points: 3 },
        'U': { count: 2, points: 3 },

        'Ą': { count: 1, points: 5 },
        'Ę': { count: 1, points: 5 },
        'F': { count: 1, points: 5 },
        'Ó': { count: 1, points: 5 },
        'Ś': { count: 1, points: 5 },
        'Ż': { count: 1, points: 5 },

        'Ć': { count: 1, points: 6 },
        'Ń': { count: 1, points: 7 },
        'Ź': { count: 1, points: 9 },
    }));

    return myLetterMap;
}

export const initializeBoardData = () => {
    const boardLayout = [
        ['TW', '', '', 'DL', '', '', '', 'TW', '', '', '', 'DL', '', '', 'TW'],
        ['', 'DW', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'DW', ''],
        ['', '', 'DW', '', '', '', 'DL', '', 'DL', '', '', '', 'DW', '', ''],
        ['DL', '', '', 'DW', '', '', '', 'DL', '', '', '', 'DW', '', '', 'DL'],
        ['', '', '', '', 'DW', '', '', '', '', '', 'DW', '', '', '', ''],
        ['', 'TL', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'TL', ''],
        ['', '', 'DL', '', '', '', 'DL', '', 'DL', '', '', '', 'DL', '', ''],
        ['TW', '', '', 'DL', '', '', '', 'DW', '', '', '', 'DL', '', '', 'TW'],
        ['', '', 'DL', '', '', '', 'DL', '', 'DL', '', '', '', 'DL', '', ''],
        ['', 'TL', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'TL', ''],
        ['', '', '', '', 'DW', '', '', '', '', '', 'DW', '', '', '', ''],
        ['DL', '', '', 'DW', '', '', '', 'DL', '', '', '', 'DW', '', '', 'DL'],
        ['', '', 'DW', '', '', '', 'DL', '', 'DL', '', '', '', 'DW', '', ''],
        ['', 'DW', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'DW', ''],
        ['TW', '', '', 'DL', '', '', '', 'TW', '', '', '', 'DL', '', '', 'TW']
    ];

    return boardLayout.map((row, y) => {
        return row.map((tile, x) => {
            let classType = 'normal-tile';
            classType = getTileClass(tile)

            return { x, y, tile, classType, letter: { value: '', points: 0 }, player: null, isAccepted: false };
        });
    });
}

export const initializeBlockLetters = (wordBlockLetters, letterMap, setWordBlockLetters, setLetterMap) => {
    const initialWordBlockLetters = wordBlockLetters !== null ? structuredClone(wordBlockLetters) : []
    const letterMapCopy = new Map(letterMap)
    const letterMapSizeCopy = letterMapCopy.size - 1
    if (letterMapSizeCopy <= 0) {
        console.log("MyLetterMapSize <= 0")
        return
    }

    const randomNumber = Math.floor(Math.random() * letterMapSizeCopy)
    const randomLetter = Array.from(letterMapCopy.keys())[randomNumber]

    const count = letterMapCopy.get(randomLetter).count
    if (count <= 0) {
        console.log("count <= 0")
        initializeBlockLetters(wordBlockLetters, letterMap, setWordBlockLetters, setLetterMap);
        return
    }

    initialWordBlockLetters.push(randomLetter)  
    letterMapCopy.get(randomLetter).count -= 1

    setWordBlockLetters(initialWordBlockLetters)
    setLetterMap(letterMapCopy)
}

export const handleDrop = (event, x, y, dragged, draggedMain, setDraggedMain, boardData, 
    setBoardData, previousBoardElements,setPreviousBoardElements, wordBlockLetters,
    setWordBlockLetters, modifyPreviousBoardElements) => {
    event.preventDefault();

    if (event.target.classList.contains("dropzone")) {
        if (draggedMain !== null && !draggedMain.event.classList[0].includes("test-div")) {
            setDraggedMain(null)
        }
        if (draggedMain !== null && draggedMain.event.classList[0].includes("test-div")) {
            const [ docX, docY ] = [ x, y ]
            const [ prevX, prevY ] = [ draggedMain.x, draggedMain.y ]
            
            const docTile = boardData.flat().find(tile => tile.x === docX && tile.y === docY)
            if ((docX === prevX && docY === prevY) || docTile.classType === "test-div") {
                setDraggedMain(null)
                return
            }

            modifyPreviousBoardElements(docX, docY)

            const changedBoardData = [...boardData]
            const changedPreviousBoardElements = [...previousBoardElements]

            const moveTile = boardData.flat().find(tile => tile.x === prevX && tile.y === prevY)
            const deepTileCopy = JSON.parse(JSON.stringify(moveTile))
            deepTileCopy.x = docX
            deepTileCopy.y = docY
            changedBoardData[y][x] = deepTileCopy

            const loadPrevTile = previousBoardElements.find(prevElem => prevElem.x === prevX && prevElem.y === prevY)
            changedBoardData[prevY][prevX] = JSON.parse(JSON.stringify(loadPrevTile))
            setBoardData(changedBoardData)

            setPreviousBoardElements(elem => elem.filter(elem => !(elem.x === prevX && elem.y === prevY)))                    

            setDraggedMain(null)
            return
        }

        const newBoardData = [...boardData];
        const droppedTile = newBoardData.flat().find(tile => tile.x === x && tile.y === y);
        
        if (droppedTile.letter.value === "" && draggedMain === null) {
            modifyPreviousBoardElements(x, y);

            droppedTile.letter.value = dragged.textContent
            droppedTile.classType = "test-div"
            
            const newWordBlockLetters = [...wordBlockLetters];
            const indexToRemove = newWordBlockLetters.indexOf(dragged.textContent);
            if (indexToRemove !== -1) {
                newWordBlockLetters.splice(indexToRemove, 1);
            }
            setWordBlockLetters(newWordBlockLetters)
            
        }
    }
}

export const handleDragStartMain = (event, x, y, setDraggedMain) => {
    setDraggedMain({event: event.target, x: x, y: y});
}