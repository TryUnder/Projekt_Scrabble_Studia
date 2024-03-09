import react from 'react'

function ScoreBoard() {
    return (
        <div className='score-board'>
            <div className='score-board-header'>
                <span>Tablica Wyników</span>
            </div>
            <div className='first-user'>
                <div className='first-user-score'>
                    <span className='first-username'>Gracz 1: Sotoran</span>
                    <span className='first-user-points'>Suma: 60</span>
                </div>
                <div className='first-user-score-friction'>
                    <span className='score-header'>Punkty Cząstkowe</span>
                    <span>10</span>
                    <span>20</span>
                    <span>30</span>
                    <span>40</span>
                </div>
            </div>

            <div className='second-user'>
                <div className='second-user-score'>
                    <span className='second-username'>Gracz 2: Agusia</span>
                    <span className='second-user-points'>Suma: 69</span>
                </div>
                <div className='second-user-score-friction'>
                    <span className='score-header'>Punkty Cząstkowe</span>
                    <span>5</span>
                    <span>4</span>
                </div>
            </div>
        </div>
    )
}

export default ScoreBoard