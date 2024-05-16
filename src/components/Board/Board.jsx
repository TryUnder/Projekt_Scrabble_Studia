import style from '../../css/Board/style_main_view.module.css'
import style2 from '../../css/Board/word_block.module.css'
import React, { useEffect, useState, useMemo, useContext, useCallback } from 'react'
import axios from 'axios'

import WordBlockLetters from "./WordsBlock"
import UserPanel from './UserPanel'
import { initializeBoardData, initializeLetterMap, initializeBlockLetters } from "./BoardUtils"
import { sendWordsToServer, checkNeighbourhood, findWords, filterWords, 
    calculatePoints, mapWordsToCoords, mapToWords, handleBlank } from './ScrabbleAlgorithms';
import { Tile } from './Tile'
import { ScoreBoard } from './ScoreBoard'
import { useLocation } from 'react-router-dom'
import { SocketContext } from '../SocketProvider.jsx'

function Board() {
    const [ boardData, setBoardData] = useState([]);
    const [ dragged, setDragged ] = useState(null);
    const [ draggedMain, setDraggedMain ] = useState(null);
    const [ previousBoardElements, setPreviousBoardElements ] = useState([])
    const [ wordBlockLetters, setWordBlockLetters ] = useState([])
    const [ letterMap, setLetterMap ] = useState(new Map())
    const [ change, setChange ] = useState(false)

    //const [ pointsState, setPointsState ] = useState({ points: 0, changeId: 0})
    // const [ sumPointsFirstUser, setPointsFirstUser ] = useState(0)
    // const [ sumPointsSecondUser, setPointsSecondUser ] = useState(0)
    // const [ pointsMapFirstUser, setPointsMapFirstUser ] = useState(new Map(null))
    // const [ pointsMapSecondUser, setPointsMapSecondUser ] = useState(new Map(null))

    const location = useLocation()
    const { receiverPlayer, senderPlayer, time, login } = location.state
    const playerLogin = useMemo(() => login, [location.state])
    const [ turn, setTurn ] = useState(receiverPlayer)

    const [ firstUserPoints, setFirstUserPoints ] = useState({
        login: receiverPlayer,
        sumPoints: 0,
        pointsMap: new Map()
    })

    const [ secondUserPoints, setSecondUserPoints ] = useState({
        login: senderPlayer,
        sumPoints: 0,
        pointsMap: new Map()
    })

    const memoizedScoreBoard = useMemo(() => <ScoreBoard firstUserPoints = { firstUserPoints } secondUserPoints = { secondUserPoints }
                                                         playerLogin = { playerLogin } />, 
                                            [firstUserPoints, secondUserPoints])
    const memoizedUserPanel = useMemo(() => <UserPanel receiverPlayer = {receiverPlayer} senderPlayer = {senderPlayer} 
                                            time = {time} playerLogin = { playerLogin } turn = { turn } />, [time, turn])
    const socket = useContext(SocketContext)

    useEffect(() => {
        setLetterMap(initializeLetterMap())
        console.log("board prev elements: ", previousBoardElements)
        console.log("LOGIN rec: ", receiverPlayer)
        console.log("LOGIN send: ", senderPlayer)
        console.log("TIME: ", time)
        console.log("PLAYER: ", playerLogin)

        const numberLetterToFetch = 7 - wordBlockLetters.length
        socket.emit('initializePlayerLetters', playerLogin, numberLetterToFetch)
        socket.on('getPlayerLetters', ({ playerLogin, playerArrayLetters }) => {
            if (login === playerLogin) {
                setWordBlockLetters(prevLetters => [...prevLetters, ...playerArrayLetters]);
            }
        })

        socket.on('boardReceive', ({ boardDataToSend, newTurn }) => {
            setBoardData(boardDataToSend)
            setTurn(newTurn)
        })

        console.log("turn: ", turn)
    }, [])

    const updatePoints = (newPoints, wordSum, words) => {
        const wordsPointsMap = new Map();
        words.forEach((word, index) => {
            const count = words.filter(w => w === word).length;
            wordsPointsMap.set({ word: word, count: count }, wordSum[index]);
        });
    
        if (playerLogin === receiverPlayer) {
            setFirstUserPoints(prevState => {
                const newPointsMap = new Map(prevState.pointsMap);
                wordsPointsMap.forEach((value, key) => {
                    newPointsMap.set(key, (newPointsMap.get(key) || 0) + value);
                });
                const newSumPoints = prevState.sumPoints + newPoints;
                socket.emit('punktyPierwszego', {
                    login: receiverPlayer,
                    sumPoints: newSumPoints,
                    pointsMap: Array.from(newPointsMap.entries())
                });
                return {
                    ...prevState,
                    login: receiverPlayer,
                    sumPoints: newSumPoints,
                    pointsMap: newPointsMap
                };
            });
        } else if (playerLogin === senderPlayer) {
            setSecondUserPoints(prevState => {
                const newPointsMap = new Map(prevState.pointsMap);
                wordsPointsMap.forEach((value, key) => {
                    newPointsMap.set(key, (newPointsMap.get(key) || 0) + value);
                });
                const newSumPoints = prevState.sumPoints + newPoints;
                socket.emit('punktyDrugiego', {
                    login: senderPlayer,
                    sumPoints: newSumPoints,
                    pointsMap: Array.from(newPointsMap.entries())
                });
                return {
                    ...prevState,
                    login: senderPlayer,
                    sumPoints: newSumPoints,
                    pointsMap: newPointsMap
                };
            });
        }
    };

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
    //     setLetterMap(initializeLetterMap());
    }, [])

    const ifIsAcceptedFalseExist = () => {
        const checkIsAccepted =  boardData.flat().find(tile => tile.letter.value !== '' && tile.isAccepted === false)
        return checkIsAccepted
    }

    const modifyPreviousBoardElements = (x, y) => {
        const newBoardData = [...boardData]
        const droppedTile = newBoardData[y][x]
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
                turn = { turn }
                playerLogin = { playerLogin }
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
    
    useEffect(() => {
        socket.on('otrzymanePunktyPierwszego', (firstUserPointsCopy) => {
            if (firstUserPointsCopy.sumPoints !== firstUserPoints.sumPoints || firstUserPointsCopy.pointsMap !== firstUserPoints.pointsMap) {
                setFirstUserPoints(prevState => ({
                    ...prevState,
                    login: firstUserPointsCopy.login,
                    sumPoints: firstUserPointsCopy.sumPoints,
                    pointsMap: new Map(firstUserPointsCopy.pointsMap)
                }));
            }
        });
        socket.on('otrzymanePunktyDrugiego', (secondUserPointsCopy) => {
            if (secondUserPointsCopy.sumPoints !== secondUserPoints.sumPoints || secondUserPointsCopy.pointsMap !== secondUserPoints.pointsMap) {
                setSecondUserPoints(prevState => ({
                    ...prevState,
                    login: secondUserPointsCopy.login,
                    sumPoints: secondUserPointsCopy.sumPoints,
                    pointsMap: new Map(secondUserPointsCopy.pointsMap)
                }));
            }
        });
    
        // Pamiętaj, aby usunąć zdarzenia, gdy komponent jest odmontowywany
        return () => {
            socket.off('punktyPierwszego');
            socket.off('punktyDrugiego');
        };
    }, [socket]);

    useEffect(() => {
        console.log("Punkty pierwszego: ", firstUserPoints)
        console.log("Punkty drugiego: ", secondUserPoints)
    }, [firstUserPoints, secondUserPoints])

    const structuredClone = (obj) => {
        return JSON.parse(JSON.stringify(obj))
    }

    const takeDownLetters = (wordsCoordsArray) => {
        const newPreviousBoardElements = [...previousBoardElements];
        const newWordBlockLetters = [...wordBlockLetters];
        const boardDataCopy = [...boardData];
        
        wordsCoordsArray.forEach((wordCoords) => {
            wordCoords.forEach(({ x, y }) => {
                if (boardDataCopy[x][y].isAccepted === false) {
                    const index = newPreviousBoardElements.findIndex(elem => elem.x === y && elem.y === x);
                    if (index !== -1) {
                        newWordBlockLetters.push(boardData[x][y].letter.value);
                        boardDataCopy[x][y] = newPreviousBoardElements[index];
                        newPreviousBoardElements.splice(index, 1);
                    }
                }
            });
        });
    
        setWordBlockLetters(newWordBlockLetters);
        setBoardData(boardDataCopy);
        setPreviousBoardElements(newPreviousBoardElements)
    };

    const checkWords = async (event) => {
        event.preventDefault();
        if (change === false && turn === playerLogin) {
            handleBlank(boardData, setBoardData)
            const { words, wordObjArray } = findWords(boardData);
            if (!boardData[7][7].isAccepted === false) {
                if (checkNeighbourhood(words, boardData)) {
                    const { isAcceptedWords, wordObjAcceptedArray } = findWords(boardData, true)
                    const { filteredWords, wordsCoordsArray }  = filterWords(wordObjArray, wordObjAcceptedArray)
                    const { wordsSum, wordSum } = calculatePoints(wordsCoordsArray, boardData, letterMap) 

                    if (filteredWords.length === 0) {
                        alert("Żadne słowo nie zostało ułożone")
                        return
                    }
                    const existInDb = await sendWordsToServer(filteredWords)
                    if (existInDb === true) {
                        updateAcceptedProperty(words)
                        //addLetters();
                        updatePoints(wordsSum, wordSum, filteredWords);
                        socket.emit('initializePlayerLetters', turn, 7 - wordBlockLetters.length)
                        const newTurn = turn === receiverPlayer ? senderPlayer : receiverPlayer
                        setTurn(newTurn)
                        socket.emit('boardSend', { boardData, newTurn })
                    } else {
                        takeDownLetters(wordsCoordsArray)
                    }
                } else {
                    alert("Nowe słowo musi być przyłączone do już istniejących")
                }
            } else if (boardData[7][7].isAccepted === false) {
                    const { isAcceptedWords, wordObjAcceptedArray } = findWords(boardData, false)
                    const wordsCoordsArray = mapWordsToCoords(wordObjArray)
                    console.log("words coords array: ", wordsCoordsArray)
                    const { wordsSum, wordSum } = calculatePoints(wordsCoordsArray, boardData, letterMap)
                    //socket.emit('sendPointsToServer', { wordsSum, wordSum, playerLogin }) 
                    const wordsMapped = mapToWords(wordsCoordsArray)
                    if (words.length === 0) {
                        alert("Żadne słowo nie zostało ułożone")
                        return
                    }
                    const existInDb = await sendWordsToServer(words)
                    if (existInDb === true) {
                        updatePoints(wordsSum, wordSum, wordsMapped);
                        updateAcceptedProperty(words)

                        socket.emit('initializePlayerLetters', turn, 7 - wordBlockLetters.length)
                        const newTurn = turn === receiverPlayer ? senderPlayer : receiverPlayer
                        setTurn(newTurn)
                        socket.emit('boardSend', { boardData, newTurn })
                        
                        //addLetters();
                    } else {
                        takeDownLetters(wordsCoordsArray)
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
            { memoizedScoreBoard }
            { memoizedUserPanel }
        </>
    )
}

export default Board;