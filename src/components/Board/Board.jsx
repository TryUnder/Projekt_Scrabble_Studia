import react from 'react'
import style from '../../css/Board/style_main_view.module.css'
import style2 from '../../css/Board/word_block.module.css'
import { useEffect, useState } from 'react'
import cookieParser from 'cookie-parser';

function Board() {
    const [ boardData, setBoardData] = useState([]);
    const [ dragged, setDragged ] = useState(null);
    const [ draggedMain, setDraggedMain ] = useState(null);
    const [ previousBoardElements, setPreviousBoardElements ] = useState([])
    const [ wordBlockLetters, setWordBlockLetters ] = useState([])
    const [ letterMap, setLetterMap ] = useState(new Map(null))
    const [ change, setChange ] = useState(false)

    const initializeBoardData = () => {
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

                return { x, y, tile, classType, letter: { value: '', points: 0 }, player: null };
            });
        });
    }
    
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

    const changeLetters = (event) => {
        if (previousBoardElements.length > 0 || change === false) {
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
        //manageDraggableProperty(false)
    }

    const initializeLetterMap = () => {
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
    }, [previousBoardElements])

    useEffect(() => {
        manageDraggableProperty(change)
    }, [change])

    useEffect(() => {
        console.log("Letter Map: ", letterMap)
        if(wordBlockLetters.length < 7 || wordBlockLetters.length == undefined) {
            initializeBlockLetters();
        }
    }, [letterMap])

    useEffect(() => {
        console.log("Board Data: ", boardData)
    }, [boardData])

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

    const handleLetterChange = (event) => {
        if (event.target.tagName === "DIV") {
            if (event.target.style.backgroundColor === "green") {
                event.target.style.backgroundColor = "#fdeb37"
                return
            }
            event.target.style.backgroundColor = "green";
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

    const renderWordBlocksLetters = () => {
        return wordBlockLetters.map((letter, index) => (
            <div 
                key = {index}
                id = {index}
                className = {style2["letter-style"]}
                draggable = { true }
                onClick = { (event) => change == true ? handleLetterChange(event) : event.preventDefault() }
                onDragStart = { (event) => handleDragStart(event) }
                onDrop = { (event) =>  setPointerEvents(event)  }
            >
                <span className = {style2["span-style"]}>{letter}</span>
            </div>
        ))
    }

    const getTileClass = (type) => {
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

    const getPolishTileClass = (word_conv) => {
        switch (word_conv) {
            case 'TW':
                return 'POTRÓJNA PREMIA SŁOWNA'
            case 'DW':
                return 'PODWÓJNA PREMIA SŁOWNA'
            case 'TL':
                return 'POTRÓJNA PREMIA LITEROWA'
            case 'DL':
                return 'PODWÓJNA PREMIA LITEROWA'
        }
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
                
                    {wordBlockLetters ?  renderWordBlocksLetters() : null}

                {
                    <div className = {style2["icon-container"]}>
                        <button className = {`${style2["letter-style-change"]}`}
                            onClick = { (event) => changeLetters(event) }
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