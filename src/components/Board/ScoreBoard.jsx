import { useEffect } from 'react'
import { react, useState, useContext } from 'react'
import style from '../../css/Board/score_board.module.css'
import { SocketContext } from '../SocketProvider.jsx'

export const ScoreBoard = ({ firstUserPoints, secondUserPoints, playerLogin }) => {
    
    return (
        <div className={style['score-board']}>
            <div className={style['score-board-header']}>
                <span className={style['score-board-header-span']}>Tablica Wyników</span>
            </div>
            <div className={`${style['first-user']} ${firstUserPoints.login === playerLogin ? style['active-player'] : ''}`}>
                <div className={`${style['first-user-score']} ${firstUserPoints.login === playerLogin ? style['active-player-score'] : ''}`}>
                    <span className={style['first-username']}>Gracz 1: {firstUserPoints.login}</span>
                    <span className={style['first-user-points']}>Suma: {firstUserPoints.sumPoints}</span>
                </div>
                <div className={style['first-user-score-friction']}>
                    <span className={style['score-header']}>Punkty Cząstkowe</span>
                    {Array.from(firstUserPoints.pointsMap.entries()).map(([key, value], index) => (
                        <div key = {index}>
                            <span>Słowo: {key.word}, Punkty: {value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={`${style['second-user']} ${secondUserPoints.login === playerLogin ? style['active-player'] : ''}`}>
                <div className={`${style['second-user-score']} ${secondUserPoints.login === playerLogin ? style['active-player-score'] : ''}`}>
                    <span className={style['second-username']}>Gracz 2: {secondUserPoints.login}</span>
                    <span className={style['second-user-points']}>Suma: {secondUserPoints.sumPoints}</span>
                </div>
                <div className={style['second-user-score-friction']}>
                    <span className={style['score-header']}>Punkty Cząstkowe</span>
                    {Array.from(secondUserPoints.pointsMap.entries()).map(([key, value], index) => (
                        <div key = {index}>
                            <span>Słowo: {key.word}, Punkty: {value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}