import { React, useState } from 'react'
import style2 from '../../css/Board/word_block.module.css'

const UserBlockLetters = ({ letter, index, change, handleDragStart, setPointerEvents }) => {
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

    const handleBlank = (event) => {
        event.preventDefault();
        setBlankState(true)
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value)
    }

    const handleInputBlur = () => {
        setBlankState(false)
        setTileValue(inputValue)
        setEdited(true)
    }
    
    const handleInputKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleInputBlur();
        }
    }

    const handleSpanClick = (event) => {
        if (!edited) {
            handleBlank(event)
        } else {
            setEdited(false)
        }
    }
    
    return (
        <div
            key = { index }
            id = { index }
            className = { style2["letter-style"] }
            draggable = { true }
            onClick = { (event) => {
                change ? handleLetterChange(event) : event.preventDefault()
                letter === 'Blank' ? handleSpanClick(event) : event.preventDefault()  
            } }
            onDragStart = { (event) => handleDragStart(event) }
            onDrop = { (event) => setPointerEvents(event) }
        >
            <span
                className = { style2["span-style"] }
            > 
                {
                    blankState ? (
                        <input
                            type = "text"
                            value = { inputValue }
                            onChange = { handleInputChange }
                            onBlur = { handleInputBlur }
                            onKeyPress = { handleInputKeyPress }
                            autoFocus
                        />
                    ) : (
                        tileValue
                    )
                }
            </span>
        </div>
        )
}

export default UserBlockLetters