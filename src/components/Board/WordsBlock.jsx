import react from 'react'
import style from '../../css/Board/word_block.module.css'

function WordsBlock() {
    const words = ["S", "W", "P", "Ź", "A", "Ż", "O", "icon", "icon", "icon"]

    return (
        <div className={style['words-block']}>
            { words.map((word, index) => (
                <div key={index} className={style["letter-style"]}>
                    <span className={style["span-style"]}>{word}</span>
                </div>
            ))}
        </div>
    )
}

export default WordsBlock