import react from 'react'

function WordsBlock() {
    const words = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "Zatwierdź", "Usuń"]

    return (
        <div className='words-block'>
            { words.map((word, index) => (
                <button key={index} type="button">{word}</button>
            ))}
        </div>
    )
}

export default WordsBlock