import React from 'react'
import style from '../../css/Board/style_main_view.module.css'
import { handleDrop, handleDragStartMain } from './BoardUtils'

export const Tile = ({ col, colIndex, rowIndex, BoardElems }) => {
    const { dragged, draggedMain, boardData, setBoardData, previousBoardElements, setPreviousBoardElements, wordBlockLetters, setWordBlockLetters, modifyPreviousBoardElements, setDraggedMain } = BoardElems;
    return (
        <div
            key = {`${rowIndex}-${colIndex}`}
            className = {style[col.classType] + " dropzone"}
            onDragOver = { (event) => {event.preventDefault();} }
            onDrop = { (event) => handleDrop(event, colIndex, rowIndex, dragged, draggedMain, setDraggedMain,
                boardData, setBoardData, previousBoardElements, setPreviousBoardElements, wordBlockLetters,
                setWordBlockLetters, modifyPreviousBoardElements) }

            draggable = { !col.isAccepted }
            onDragStart = { (event) => handleDragStartMain(event, colIndex, rowIndex, setDraggedMain) }
            style = { col.isAccepted ? { border: '2px solid black' } : null }
        >
        <span
            className = { col.letter.value === '' ? style['span-style'] : style['span-new'] }
        >
            { col.letter.value === '' ? getPolishTileClass(col.tile) : col.letter.value }
        </span>
        </div>
    )
}

export const getPolishTileClass = (word_conv) => {
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