import { useEffect } from 'react'
import { react, useState } from 'react'
import style from '../../css/Board/score_board.module.css'

export const ScoreBoard = ({ points = 0 , arrayPointsMap, changeId }) => {
    const [ userPoints, setUserPoints] = useState(0)
    const [ userPointsTable, setUserPointsTable ] = useState([])
    const [ arrayPointsMapState, setArrayPointsMap ] = useState(new Map())

    useEffect(() => {
        console.log("NOWY CLG: ", points)
        setUserPoints(userPoints + points)
        // const copyPointsTable = [...userPointsTable]
        // copyPointsTable.push(points)
        // setUserPointsTable(copyPointsTable);
        if (arrayPointsMap.size > 0) {
            setArrayPointsMap(prevMap => new Map([...prevMap, ...arrayPointsMap]))
        }
    }, [changeId])

    return (
        <>
        {
            console.log("z score board points: ", points)
        }
            <div className={style['score-board']}>
                <div className={style['score-board-header']}>
                    <span className={style['score-board-header-span']}>Tablica Wyników</span>
                </div>
                <div className={style['first-user']}>
                    <div className={style['first-user-score']}>
                        <span className={style['first-username']}>Gracz 1: Sotoran</span>
                        <span className={style['first-user-points']}>Suma: { userPoints }</span>
                    </div>
                    <div className={style['first-user-score-friction']}>
                        <span className={style['score-header']}>Punkty Cząstkowe</span>
                        {arrayPointsMapState.size > 0 ? Array.from(arrayPointsMapState.entries()).map(([key, value], index) => (
                            <span key={index}>
                                {key.word} : {value}
                            </span>
                        )) : null }
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
        </>
    )
}