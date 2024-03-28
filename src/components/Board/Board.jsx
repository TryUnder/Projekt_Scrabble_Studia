import react from 'react'
import style from '../../css/Board/style_main_view.module.css'
import style2 from '../../css/Board/word_block.module.css'
import { useEffect, useState } from 'react'

function Board() {
    const [ dragged, setDragged ] = useState(null);

    const words = ["S", "W", "P", "Ź", "A", "Ż", "O", "icon", "icon", "icon"]

    const boardData = [
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

    return(
        <>
            <div className={style['board']}>
                {renderBoardTiles()}
            </div>

            <div className={style2['words-block']}>
            { words.map((word, index) => (
                <div 
                    key={index} 
                    id={index} 
                    className={style2["letter-style"]} 
                    draggable={word != "icon" ? true : false } 
                    onDragStart={(event) => handleDragStart(event)} >
                    
                    <span className={style2["span-style"]}>{word}</span>
                </div>
            ))}
            </div>
        </>
    )
}

export default Board;