import { React, useState } from 'react'
import style2 from '../../css/Board/word_block.module.css'

const UserBlockLetters = ({ letter, index, change, handleDragStart, setPointerEvents, turn, playerLogin }) => {
    const [ blankState, setBlankState ] = useState(false)
    const [ inputValue, setInputValue ] = useState('')
    const [ tileValue, setTileValue ] = useState(letter)
    const [ edited, setEdited ] = useState(false);

    const handleLetterChange = (event) => {
        if (event.target.tagName === "DIV") {
            if (event.target.style.backgroundColor === "green") {
                event.target.style.backgroundColor = "#fdeb37"
                return
            }
            event.target.style.backgroundColor = "green";
        }
    }
    
    return (
        <div
            key = { index }
            id = { index }
            className = { style2["letter-style"] }
            draggable = { turn === playerLogin ? true : false }
            onClick = { (event) => { change ? handleLetterChange(event) : event.preventDefault() } }
            onDragStart = { (event) => handleDragStart(event) }
            onDrop = { (event) => setPointerEvents(event) }
        >
            <span
                className = { style2["span-style"] }
            > 
                {
                    letter
                }
            </span>
        </div>
        )
}

export default UserBlockLetters