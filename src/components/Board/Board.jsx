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
        const initialWordBlockLetters = ["S", "W", "P", "Ź", "A", "Z", "Ż"]
        return initialWordBlockLetters
    }

    useEffect(() => {
        setBoardData(initializeBoardData());
    }, [])

    useEffect(() => {
        setWordBlockLetters(initializeBlockLetters())
    }, [])

    useEffect(() => {
        console.log(previousBoardElements)
    }, [previousBoardElements])

    useEffect(() => {
        console.log(boardData)
    }, [boardData])

    const handleDrop = (event, x, y) => {
        event.preventDefault();

        if (event.target.classList.contains("dropzone")) {
            if (draggedMain !== null) {
                if (draggedMain.event.classList[0].includes("test-div")) {
                    setDraggedMain(null)
                    return
                }
            }
            const newBoardData = [...boardData];
            const droppedTile = newBoardData.flat().find(tile => tile.x === x && tile.y === y);
            if (draggedMain != null) {
                console.log(draggedMain.event.classList)
                if (draggedMain.event.classList[0].includes("test-div")) {
                    console.log("contains")
                }
            }
            if (droppedTile.letter.value === "") {
                const newPreviousBoardElements = [...previousBoardElements]
                const newObj = JSON.parse(JSON.stringify(droppedTile))
                newPreviousBoardElements.push(newObj)
                setPreviousBoardElements(newPreviousBoardElements)
                //dragged.parentNode.removeChild(dragged)

                droppedTile.letter.value = dragged.textContent
                droppedTile.classType = "test-div"
                setBoardData(newBoardData)
                
                const newWordBlockLetters = wordBlockLetters.filter(letter => letter !== dragged.textContent)
                setWordBlockLetters(newWordBlockLetters)
                
            }
        } 
    }

    const handleDropMain = (event) => {
        event.preventDefault();

        if (event.target.classList.contains("dropzone")) {
            console.log(event.target)
            if (draggedMain.event.classList[0].includes("test-div")) {
                const x = draggedMain.x
                const y = draggedMain.y

                console.log("X:", x, "Y:", y);
                
                const droppedElement = previousBoardElements.find(tile => tile.x === x && tile.y === y)
                console.log("Previous Board Elements: ", previousBoardElements)
                console.log("Dropped Element: ", droppedElement)

                if (droppedElement) {
                    const newBoardData = [...boardData]
                    newBoardData[y][x] = droppedElement
                    setBoardData(newBoardData)

                    const newWordBlockLetters = [...wordBlockLetters]
                    newWordBlockLetters.push(draggedMain.event.textContent)
                    setWordBlockLetters(newWordBlockLetters)

                    const newPreviousBoardElements = previousBoardElements.filter(element => !(element.x === x && element.y === y))
                    setPreviousBoardElements(newPreviousBoardElements)
                }
            }
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
                onDragStart = { (event) => handleDragStart(event) }
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
        console.log(draggedMain)
    }, [draggedMain])
    
    //const words = ["S", "W", "P", "Ź", "A", "Ż", "O"]
    const letters = ["S", "W", "P", "Ź", "A", "Ż", "O"];
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
                
                    {renderWordBlocksLetters()}

                {
                    <div className = {style2["icon-container"]}>
                        <button className = {`${style2["letter-style"]}`}>
                            <i className = {`${["fas fa-solid fa-square-check"]} ${style2["icon-style"]}`}></i>
                        </button>
                        <button className = {`${style2["letter-style"]}`}>
                            <i className = {`${["fas fa-solid fa-square-poll-vertical"]} ${style2["icon-style"]}`}></i>
                        </button>
                        <button className = {`${style2["letter-style"]}`}>
                            <i className = {`${["fas fa-solid fa-square-xmark"]} ${style2["icon-style"]}`}></i>
                        </button>
                    </div>
                }
            </div>
        </>
    )
}

export default Board;