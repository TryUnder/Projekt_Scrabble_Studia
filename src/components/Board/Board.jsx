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

    useEffect(() => {
        setBoardData(initializeBoardData());
    }, [])

    useEffect(() => {
        console.log(previousBoardElements)
    }, [previousBoardElements])

    const handleDrop = (event, x, y) => {
        event.preventDefault();

        if (event.target.classList.contains("dropzone")) {
            const newBoardData = [...boardData];
            const droppedTile = newBoardData.flat().find(tile => tile.x === x && tile.y === y);

            if (droppedTile.letter.value === "") {
                const newPreviousBoardElements = [...previousBoardElements]
                const newObj = JSON.parse(JSON.stringify(droppedTile))
                newPreviousBoardElements.push(newObj)
                setPreviousBoardElements(newPreviousBoardElements)
                dragged.parentNode.removeChild(dragged)

                droppedTile.letter.value = dragged.textContent
                droppedTile.classType = "test-div"
                setBoardData(newBoardData)
            }
        }
    }

    const handleDropMain = (event) => {
        event.preventDefault();

        if (event.target.classList.contains("dropzone")) {
            console.log(event.target)
            if (draggedMain.classList[0].includes("test-div")) {
                console.log("contains test div")
                var div = document.createElement("div")
                div.textContent = event.target.textContent;
                draggedMain.appendChild(div);
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
                    onDragStart = { (event) => handleDragStartMain(event) }
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

    // const getTileClassSpan = (type) => {
    //     switch (type) {
    //         case 'TW':
    //             return 'triple-word-score-span'
    //         case 'DW':
    //             return 'double-word-score-span'
    //         case 'TL':
    //             return 'triple-letter-score-span'
    //         case 'DL':
    //             return 'double-letter-score-span'
    //         default:
    //             return 'normal-span'
    //     }
    // }

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

    const handleDragStartMain = (event) => {
        setDraggedMain(event.target);
    }

    useEffect(() => {
        //console.log(dragged)
    }, [dragged])
    
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
                {letters.map((letter, index) => (
                    <div
                        key = {index}
                        id = {index}
                        className = {style2["letter-style"]}
                        draggable = { true }
                        onDragStart = { (event) => handleDragStart(event) }
                    >
                        <span
                            className = {style2["span-style"]}
                            >
                            {letter} 
                        </span>
                    </div>
                ))}

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