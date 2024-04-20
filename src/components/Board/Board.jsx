import style from '../../css/Board/style_main_view.module.css'
import style2 from '../../css/Board/word_block.module.css'
import React, { useEffect, useState } from 'react'
import cookieParser from 'cookie-parser';

import WordBlockLetters from "./WordsBlock"
import { getTileClass, getPolishTileClass, initializeBoardData, initializeLetterMap } from "./BoardUtils"

function Board() {
    const [ boardData, setBoardData] = useState([]);
    const [ dragged, setDragged ] = useState(null);
    const [ draggedMain, setDraggedMain ] = useState(null);
    const [ previousBoardElements, setPreviousBoardElements ] = useState([])
    const [ wordBlockLetters, setWordBlockLetters ] = useState([])
    const [ letterMap, setLetterMap ] = useState(new Map(null))
    const [ change, setChange ] = useState(false)
    
    const initializeBlockLetters = () => {
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
            initializeBlockLetters();
            return
        }

        initialWordBlockLetters.push(randomLetter)  
        letterMapCopy.get(randomLetter).count -= 1

        setWordBlockLetters(initialWordBlockLetters)
        setLetterMap(letterMapCopy)
    }

    const manageDraggableProperty = (condition) => {
        Array.from( {length: wordBlockLetters.length } ).map((_, index) => {
            const letterDiv = document.getElementById(index);
            condition === true ? letterDiv.draggable = false : letterDiv.draggable = true
        })
    }

    const handleChangeLetterClick = (event) => {
        setChange(true)
    }

    const checkNeighbourhood = (words) => {
        let allAdjacent = true;
    
        // Pętla po wszystkich wyrazach
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
    
            // Pętla po literach w danym wyrazie
            for (let j = 0; j < word.length; j++) {
                const letter = word[j];
    
                // Znajdź kafelek na planszy zawierający daną literę
                const tile = findTileByLetter(boardData, letter);
    
                if (!tile) {
                    // Jeśli nie znaleziono kafelka, ustaw flagę na false i przerwij pętlę
                    allAdjacent = false;
                    break;
                }
    
                // Sprawdź, czy istnieje sąsiadujący kafelek z literą z innego wyrazu
                let foundAdjacent = false;
    
                for (let k = 0; k < words.length; k++) {
                    if (k !== i) {
                        const otherWord = words[k];
    
                        for (let l = 0; l < otherWord.length; l++) {
                            const otherLetter = otherWord[l];
                            const otherTile = findTileByLetter(boardData, otherLetter);
    
                            if (areAdjacent(tile, otherTile)) {
                                foundAdjacent = true;
                                break;
                            }
                        }
    
                        if (foundAdjacent) {
                            break;
                        }
                    }
                }
    
                // Jeśli nie znaleziono sąsiadującego kafelka, ustaw flagę na false i przerwij pętlę
                if (!foundAdjacent) {
                    allAdjacent = false;
                    break;
                }
            }
    
            // Jeśli flaga została ustawiona na false, przerwij pętlę
            if (!allAdjacent) {
                break;
            }
        }
    
        // Zwróć wynik sprawdzania
        if (allAdjacent) {
            console.log("Wszystkie wyrazy są obok siebie");
        } else {
            console.log("Nie wszystkie wyrazy są obok siebie");
        }
    }
    
    // Funkcja pomocnicza do znalezienia kafelka na planszy na podstawie litery
    const findTileByLetter = (boardData, letter) => {
        for (let i = 0; i < boardData.length; i++) {
            for (let j = 0; j < boardData[i].length; j++) {
                if (boardData[i][j].letter.value === letter) {
                    return boardData[i][j];
                }
            }
        }
        return null;
    }
    
    // Funkcja pomocnicza do sprawdzenia, czy dwa kafelki sąsiadują ze sobą
    const areAdjacent = (tile1, tile2) => {
        const dx = Math.abs(tile1.x - tile2.x);
        const dy = Math.abs(tile1.y - tile2.y);
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    }

    const increaseLetterCount = (letter) => {
        const letterMapCopy = new Map(letterMap)
        const count = letterMapCopy.get(letter).count

        if (count >= 0) {
            letterMapCopy.get(letter).count += 1;
            setLetterMap(letterMapCopy)
        } 
    }

    const findWords = () => {
        const words = [];
        boardData.map((row, x) => {
            let word = '';
            row.map((column, y) => {
                const tile = boardData[x][y]
                if (tile.letter.value !== '') {
                    word += tile.letter.value;
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
                    word += tile.letter.value;
                } else {
                    if (word.length > 1) {
                        words.push(word);
                    }
                    word = '';
                }
            })
        })

        if (boardData[7][7].letter.value !== '') {
            return words
        } else {
            alert("Słowo musi przechodzić przez środek planszy!")
            return
        }
    }

    const changeLettersCheckWords = (event) => {
        //CheckBoard   
        if (previousBoardElements.length > 0 || change === false) {

            const words = findWords();
            console.log(words)
            checkNeighbourhood(words)
            setChange(false)
            return
        }

        // Exchange letters
        const arrayBcg = []
        var arrayBcgCopy = null
        Array.from({ length: wordBlockLetters.length }).map((_, index) => {
            const letterDiv = document.getElementById(index)
            if (window.getComputedStyle(letterDiv).backgroundColor === 'rgb(0, 128, 0)') {
                arrayBcg.push(letterDiv.textContent)
                letterDiv.style.backgroundColor = "#fdeb37";
            }
        })

        if (arrayBcg.length === 0) {
            setChange(false)
            return
        }
        arrayBcgCopy = structuredClone(arrayBcg)

        const wordBlockLettersCopy = [...wordBlockLetters];

        const filteredWordBlockLetters = wordBlockLettersCopy.filter(letter => {
            const index = arrayBcg.indexOf(letter);
            if (index !== -1) {
                arrayBcg.splice(index, 1);
                return false;
            }
            return true; 
        });

        arrayBcgCopy.forEach(letter => {
            increaseLetterCount(letter)
        })

        setWordBlockLetters(filteredWordBlockLetters)
        setChange(false)
        //manageDraggableProperty(false)
    }

    useEffect(() => {
        setBoardData(initializeBoardData());
        setLetterMap(initializeLetterMap());
    }, [])

    useEffect(() => {
        if (wordBlockLetters.length < 7 && change) {
            if (previousBoardElements.length + wordBlockLetters.length < 7) {
                initializeBlockLetters();
                setChange(false);
            }
        }
    }, [wordBlockLetters, change]);

    useEffect(() => {
        manageDraggableProperty(change)
    }, [change])

    useEffect(() => {
        if(wordBlockLetters.length < 7 || wordBlockLetters.length == undefined) {
            initializeBlockLetters();
        }
    }, [letterMap])

    useEffect(() => {
        console.log("Board Data: ", boardData)
    }, [boardData])

    useEffect(() => {
        console.log("Dragged", dragged)
    }, [dragged])

    const modifyPreviousBoardElements = (x, y) => {
        const newBoardData = [...boardData]
        const droppedTile = newBoardData.flat().find(tile => tile.x === x && tile.y === y);
        const newPreviousBoardElements = [...previousBoardElements]
        const newObj = JSON.parse(JSON.stringify(droppedTile))
        newPreviousBoardElements.push(newObj)
        setPreviousBoardElements(newPreviousBoardElements)
    }

    const handleDrop = (event, x, y) => {
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
                
                const newWordBlockLetters = wordBlockLetters.filter(letter => letter !== dragged.textContent)
                setWordBlockLetters(newWordBlockLetters)
                
            }
        }
    }

    const handleDropMain = (event) => {
        event.preventDefault();

        if (event.target.classList.contains("dropzone") || event.target.parentElement.classList[0].includes("words-block") 
            || event.target.parentElement.parentElement.classList[0].includes("words-block")) {
            if (draggedMain.event.classList[0].includes("test-div")) {
                const x = draggedMain.x
                const y = draggedMain.y
                
                const droppedElement = previousBoardElements.find(tile => tile.x === x && tile.y === y)

                if (droppedElement) {
                    const newBoardData = [...boardData]
                    newBoardData[y][x] = droppedElement
                    setBoardData(newBoardData)

                    const newWordBlockLetters = [...wordBlockLetters]
                    newWordBlockLetters.push(draggedMain.event.textContent)
                    setWordBlockLetters(newWordBlockLetters)

                    const newPreviousBoardElements = previousBoardElements.filter(element => !(element.x === x && element.y === y))
                    setPreviousBoardElements(newPreviousBoardElements)

                    setDraggedMain(null)
                }
            }
            setDraggedMain(null)
        }
    }

    const setPointerEvents = (event) => {
        event.preventDefault();
        if (event.target.parentElement.classList[0].includes("words-block")) {
            handleDragStart(event.target.parentElement)
        }
    }

    const renderBoardTiles = () => {
        return boardData.map((row, rowIndex) => (
            row.map((col, colIndex) => (
                <div 
                    key={`row-${rowIndex} col-${colIndex}`} 
                    className={style[col.classType] + " dropzone"}
                    onDragOver={(event) => {event.preventDefault();}}
                    onDrop={(event) => handleDrop(event, colIndex, rowIndex)}

                    draggable = { true }
                    onDragStart = { (event) => handleDragStartMain(event, colIndex, rowIndex) }
                    >

                    <span 
                        className = { col.letter.value == '' ? style['span-style'] : style['span-new']}
                    > 
                    
                        { col.letter.value == '' ? getPolishTileClass(col.tile) : col.letter.value }
                    </span>
                </div>
            ))
        ))
    };

    const renderUserBlockLetters = () => {
        return wordBlockLetters.map((letter, index) => (
            <WordBlockLetters 
                letter = { letter }
                index = { index }
                change = { change }
                handleDragStart = { handleDragStart }
                setPointerEvents = { setPointerEvents }
            />
        ))
    }

    const handleDragStart = (event) => {
        setDragged(event.target);
    }

    const handleDragStartMain = (event, x, y) => {
        setDraggedMain({event: event.target, x: x, y: y});
    }

    useEffect(() => {
    }, [draggedMain])
    
    const icons = ["potwierdz", "wymien", "pasuj"]

    return(
        <>
            <div className={style['board']}>
                {renderBoardTiles()}
            </div>

            <div 
                className = {style2['words-block'] + " dropzone"} 
                onDragOver = { (event) => event.preventDefault() }
                onDrop = { (event) => handleDropMain(event) }
            >
                
                    {wordBlockLetters ?  renderUserBlockLetters() : null}

                {
                    <div className = {style2["icon-container"]}>
                        <button className = {`${style2["letter-style-change"]}`}
                            onClick = { (event) => changeLettersCheckWords(event) }
                        >
                            <i className = {`${["fas fa-solid fa-check"]} ${style2["icon-style"]}`}></i>
                        </button>
                        <button className = {`${style2["letter-style-change"]}`}
                                onClick = { (event) => handleChangeLetterClick(event) }        
                        >
                            <i className = {`${["fas fa-solid fa-arrows-spin"]} ${style2["icon-style"]}`}></i>
                        </button>
                        <button className = {`${style2["letter-style-change"]}`}>
                            <i className = {`${["fas fa-solid fa-xmark"]} ${style2["icon-style"]}`}></i>
                        </button>
                    </div>
                }
            </div>
        </>
    )
}

export default Board;