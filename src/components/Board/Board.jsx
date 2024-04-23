import style from '../../css/Board/style_main_view.module.css'
import style2 from '../../css/Board/word_block.module.css'
import React, { useEffect, useState } from 'react'
import cookieParser from 'cookie-parser';

import WordBlockLetters from "./WordsBlock"
import { getTileClass, getPolishTileClass, initializeBoardData, initializeLetterMap } from "./BoardUtils"
import axios from 'axios';

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

    const sendWordsToServer = async (words) => {
        try {
            const response = await axios.post("/api/checkWords", words)
            const responseData = response.data
            console.log("response: ", responseData)
            return responseData
        } catch (error) {
            console.error("Błąd podczas wysyłania words na serwer: ", error)
        }
    }

    const updateAcceptedProperty = (words) => {
        const boardDataCopy = [...boardData]

        words.forEach(word => {
            [...word].forEach(letter => {
                boardDataCopy.flat().forEach(cell => {
                    if (cell.letter.value === letter) {
                        cell.isAccepted = true;
                    }
                });
            });
        });
    
        setBoardData(boardDataCopy)
    }

    const addLetters = () => {
        initializeBlockLetters();
    }

    const checkNeighbourhood = (words) => {
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

    const changeLettersCheckWords = async (event) => {
        //CheckBoard   
        if (previousBoardElements.length > 0 && change === false) {

            const words = findWords();
            console.log("words: ", words)
            if (!boardData[7][7].isAccepted === false) {
                if (checkNeighbourhood(words)) {
                    console.log("Words: ", words)
                    const existInDb = await sendWordsToServer(words)
                    if (existInDb === true) {
                        console.log("exis", existInDb)
                        updateAcceptedProperty(words)
                        addLetters();
                    }
                } else {
                    alert("Nowe słowo musi być przyłączone do już istniejących")
                }
            } else if (boardData[7][7].isAccepted === false) {
                console.log("IsAccepted: false")
                if (words.length === 1) {
                    console.log("words.length = 1");
                    
                }
                const existInDb = await sendWordsToServer(words)
                if (existInDb === true) {
                    console.log("exis", existInDb)
                    updateAcceptedProperty(words)
                    addLetters();
                }
            }
            setChange(false)
            return
        } else {
            // Exchange letters
            const ifExists = ifIsAcceptedFalseExist();
            if (ifExists !== undefined) {
                alert("Nie można wymienić liter podczas gdy inne znajdują się już na planszy")
                setChange(false)
                return
            }
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
            
        }

        //manageDraggableProperty(false)
    }

    useEffect(() => {
        setBoardData(initializeBoardData());
        setLetterMap(initializeLetterMap());
    }, [])

    const ifIsAcceptedFalseExist = () => {
        const checkIsAccepted =  boardData.flat().find(tile => tile.letter.value !== '' && tile.isAccepted === false)
        return checkIsAccepted
    }

    // useEffect(() => {
    //     if (wordBlockLetters.length < 7 && change) {
    //         if (previousBoardElements.length + wordBlockLetters.length < 7) {
    //             const ifExists = ifIsAcceptedFalseExist();
    //             console.log("If exists: ", ifExists)

    //         }
    //     }
    // }, [wordBlockLetters, change]);

    useEffect(() => {
        manageDraggableProperty(change)
    }, [change])

    useEffect(() => {
        if(wordBlockLetters.length < 7) {
            const ifExists = ifIsAcceptedFalseExist();
            if (ifExists === undefined) {
                initializeBlockLetters();
            }
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
                
                const newWordBlockLetters = [...wordBlockLetters];
                const indexToRemove = newWordBlockLetters.indexOf(dragged.textContent);
                if (indexToRemove !== -1) {
                    newWordBlockLetters.splice(indexToRemove, 1);
                }
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

                    draggable = { !col.isAccepted }
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