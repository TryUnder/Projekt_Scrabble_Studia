import react from 'react'
import style from '../../css/Board/score_board.module.css'

function ScoreBoard() {
    return (
        <div className={style['score-board']}>
            <div className={style['score-board-header']}>
                <span className={style['score-board-header-span']}>Tablica Wyników</span>
            </div>
            <div className={style['first-user']}>
                <div className={style['first-user-score']}>
                    <span className={style['first-username']}>Gracz 1: Sotoran</span>
                    <span className={style['first-user-points']}>Suma: 60</span>
                </div>
                <div className={style['first-user-score-friction']}>
                    <span className={style['score-header']}>Punkty Cząstkowe</span>
                    <span>10</span>
                    <span>20</span>
                    <span>30</span>
                    <span>40</span>
                </div>
            </div>

            <div className={style['second-user']}>
                <div className={style['second-user-score']}>
                    <span className={style['second-username']}>Gracz 2: Agusia</span>
                    <span className={style['second-user-points']}>Suma: 69</span>
                </div>
                <div className={style['second-user-score-friction']}>
                    <span className={style['score-header']}>Punkty Cząstkowe</span>
                    <span>5</span>
                    <span>4</span>
                </div>
            </div>
        </div>
    )
}

export default ScoreBoard