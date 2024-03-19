import react from 'react'
import style from '../../css/Board/word_block.module.css'

function WordsBlock() {
    const words = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "Zatwierdź", "Usuń"]

    return (
        <div className={style['words-block']}>
            { words.map((word, index) => (
                <button key={index} type="button">{word}</button>
            ))}
        </div>
    )
}

export default WordsBlock