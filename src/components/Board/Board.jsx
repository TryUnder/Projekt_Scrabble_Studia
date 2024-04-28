import style from '../../css/Board/style_main_view.module.css'
import style2 from '../../css/Board/word_block.module.css'
import React, { useEffect, useState } from 'react'
import cookieParser from 'cookie-parser';

import WordBlockLetters from "./WordsBlock"
import { initializeBoardData, initializeLetterMap, initializeBlockLetters } from "./BoardUtils"
import { sendWordsToServer, checkNeighbourhood, findWords, findIsAcceptedWords, filterWords } from './ScrabbleAlgorithms';
import { Tile } from './Tile'
import axios from 'axios';

function Board() {
    const [ boardData, setBoardData] = useState([]);
    const [ dragged, setDragged ] = useState(null);
    const [ draggedMain, setDraggedMain ] = useState(null);
    const [ previousBoardElements, setPreviousBoardElements ] = useState([])
    const [ wordBlockLetters, setWordBlockLetters ] = useState([])
    const [ letterMap, setLetterMap ] = useState(new Map(null))
    const [ change, setChange ] = useState(false)

    const manageDraggableProperty = (condition) => {
        Array.from( {length: wordBlockLetters.length } ).map((_, index) => {
            const letterDiv = document.getElementById(index);
            condition === true ? letterDiv.draggable = false : letterDiv.draggable = true
        })
    }

    const increaseLetterCount = (letter) => {
        const letterMapCopy = new Map(letterMap)
        const count = letterMapCopy.get(letter).count

        if (count >= 0) {
            letterMapCopy.get(letter).count += 1;
            setLetterMap(letterMapCopy)
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
        initializeBlockLetters(wordBlockLetters, letterMap, setWordBlockLetters, setLetterMap);
    }

    const changeLettersCheckWords = async (event) => {
        //CheckBoard   
        console.log("BD: ", boardData[7][7])
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

    useEffect(() => {
        setBoardData(initializeBoardData());
        setLetterMap(initializeLetterMap());
    }, [])

    const ifIsAcceptedFalseExist = () => {
        const checkIsAccepted =  boardData.flat().find(tile => tile.letter.value !== '' && tile.isAccepted === false)
        return checkIsAccepted
    }

    useEffect(() => {
        manageDraggableProperty(change)
    }, [change])

    useEffect(() => {
        if(wordBlockLetters.length < 7) {
            const ifExists = ifIsAcceptedFalseExist();
            if (ifExists === undefined) {
                initializeBlockLetters(wordBlockLetters, letterMap, setWordBlockLetters, setLetterMap);
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

    const setPointerEvents = (event) => {
        event.preventDefault();
        if (event.target.parentElement.classList[0].includes("words-block")) {
            setDragged(event.target.parentElement)
        }
    }

    const renderBoardTiles = () => {
        const tileProps = { dragged, draggedMain, setDraggedMain, previousBoardElements, setPreviousBoardElements,
            modifyPreviousBoardElements, boardData, setBoardData, wordBlockLetters, setWordBlockLetters }
        return boardData.map((row, rowIndex) => (
            row.map((col, colIndex) => (
                <Tile 
                    col = { col }
                    colIndex = { colIndex }
                    rowIndex = { rowIndex }
                    BoardElems = { tileProps }
                />
            ))
        ))
    };

    const renderUserBlockLetters = () => {
        return wordBlockLetters.map((letter, index) => (
            <WordBlockLetters 
                letter = { letter }
                index = { index }
                change = { change }
                handleDragStart = { (event) => setDragged(event.target) }
                setPointerEvents = { setPointerEvents }
            />
        ))
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

    const checkWords = async (event) => {
        event.preventDefault();
        if (previousBoardElements.length > 0 && change === false) {

            const words = findWords(boardData);
            console.log("words: ", words)
            if (!boardData[7][7].isAccepted === false) {
                if (checkNeighbourhood(words, boardData)) {
                    console.log("Words: ", words)
                    const isAcceptedWords = findWords(boardData, true)
                    console.log("is accepted words: ", isAcceptedWords)
                    const filteredWords = filterWords(words, isAcceptedWords)
                    console.log("FILTERED WORDS: ", filteredWords)
                    const existInDb = await sendWordsToServer(filteredWords)
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
        }
    }

    return (
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
                        <button 
                            className = {`${style2["letter-style-change"]}`}
                            onClick = { (event) => setChange(true) }        
                        >
                            <i className = {`${["fas fa-solid fa-arrows-spin"]} ${style2["icon-style"]}`}></i>
                        </button>
                        <button 
                            className = {`${style2["letter-style-change"]}`}
                            onClick = { (event) => checkWords(event) }
                        >
                            
                            <i className = {`${["fas fa-solid fa-spell-check"]} ${style2["icon-style"]}`}></i>
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