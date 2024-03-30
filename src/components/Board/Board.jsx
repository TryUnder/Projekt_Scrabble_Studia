import react from 'react'
import style from '../../css/Board/style_main_view.module.css'
import style2 from '../../css/Board/word_block.module.css'
import { useEffect, useState } from 'react'

function Board() {
    const [ boardData, setBoardData] = useState([]);
    const [ dragged, setDragged ] = useState(null);

    const initializeBoardData = () => {
        return [
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
    } 

    useEffect(() => {
        setBoardData(initializeBoardData());
    }, [])

    useEffect(() => {
        console.log(boardData)
    }, [boardData])

    const handleDrop = (event) => {
        event.preventDefault();

        if (event.target.classList.contains("dropzone")) {
            dragged.parentNode.removeChild(dragged)
            event.target.innerText = "x"
        }
    }

    const renderBoardTiles = () => {
        return boardData.map((row, rowIndex) => (
            row.map((col, colIndex) => (
                <div 
                    key={`row-${rowIndex} col-${colIndex}`} 
                    className={style[getTileClass(col)] + ' dropzone'}
                    onDragOver={(event) => {event.preventDefault();}}
                    onDrop={(event) => handleDrop(event)}
                    >

                    <span 
                        className={style[getTileClassSpan(col)]}>{getPolishTileClass(col)}
                    </span>
                </div>
            ))
        ))
    };

    const getTileClass = (type) => {
        switch (type) {
            case 'TW':
                return 'triple-word-score-tile'
            case 'DW':
                return 'double-word-score-tile'
            case 'TL':
                return 'triple-letter-score-tile'
            case 'DL':
                return 'double-letter-score-tile'
            default:
                return 'normal-tile'
        }
    }

    const getTileClassSpan = (type) => {
        switch (type) {
            case 'TW':
                return 'triple-word-score-span'
            case 'DW':
                return 'double-word-score-span'
            case 'TL':
                return 'triple-letter-score-span'
            case 'DL':
                return 'double-letter-score-span'
            default:
                return 'normal-span'
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

    useEffect(() => {
        console.log(dragged)
    }, [dragged])
    
    const words = ["S", "W", "P", "Ź", "A", "Ż", "O"]
    const letters = ["S", "W", "P", "Ź", "A", "Ż", "O"];
    const icons = ["potwierdz", "odrzuc", "pasuj"]

    const assignIcons = (word) => {
        if (word === "potwierdz") {
            return " fa-solid fa-square-check fa-2x"
        } else if (word === "odrzuc") {
            return " fa-solid fa-square-xmark"
        } else if (word === "pasuj") {
            return " fa-solid fa-rotate"
        }
        return null
    } 

    const checkWhetherIcon = (word, bool) => {
        if (bool == true) {
            if (word !== "potwierdz" && word !== "odrzuc" && word !== "pasuj") {
                return true
            }
            return false
            
        } else if (bool == false) {
            if (word !== "potwierdz" && word !== "odrzuc" && word !== "pasuj") {
                return word
            }
            return null
        }

    }

    return(
        <>
            <div className={style['board']}>
                {renderBoardTiles()}
            </div>

            {/* <div className={style2['words-block']}>
            { words.map((word, index) => (
                <div 
                    key={index} 
                    id={index} 
                    className={`${style2["letter-style"]} ${assignIcons(word)}`} 
                    draggable={checkWhetherIcon(word, true) ? true : false } 
                    onDragStart={(event) => handleDragStart(event)} >
                    
                    <span className={style2["span-style"]}>{checkWhetherIcon(word, false)}</span>
                </div>
            ))}
            </div> */}

            <div 
                className = {style2['words-block']} 
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

                {icons.map((icon, index) => (
                    <div
                        key = {index}
                        id = {index}
                        className = {`${style2["letter-style"]} fas fa-solid fa-square-check`}
                    >

                    </div>
                ))}
            </div>
        </>
    )
}

export default Board;