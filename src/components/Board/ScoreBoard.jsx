import { useEffect } from 'react'
import { react, useState, useContext } from 'react'
import style from '../../css/Board/score_board.module.css'
import { SocketContext } from '../SocketProvider.jsx'

export const ScoreBoard = ({ points = 0 , arrayPointsMap, changeId, firstUser, secondUser, playerLogin, socket }) => {
    const [ firstLoginName, setUsers ] = useState(firstUser)
    const [ secondLoginName, setSecondLoginName ] = useState(secondUser)
    const [ userPoints, setUserPoints] = useState(0)
    const [ secondUserPoints, setSecondUserPoints ] = useState(0)
    const [ userPointsTable, setUserPointsTable ] = useState([])
    const [ arrayPointsMapState, setArrayPointsMap ] = useState(new Map())
    const [ arrayPointsMapStateSecond, setArrayPointsMapSecond ] = useState(new Map())
    const [ playerLoginx, setPlayerLogin ] = useState(playerLogin)

    useEffect(() => {
        console.log("NOWY CLG: ", points)
        if (arrayPointsMap.size > 0 || arrayPointsMapStateSecond.size > 0) {
            if (playerLoginx === firstLoginName) {
                setUserPoints(userPoints + points)
                setArrayPointsMap(prevMap => new Map([...prevMap, ...arrayPointsMap]))
            } else if (playerLoginx === secondLoginName) {
                setSecondUserPoints(secondUserPoints + points)
                setArrayPointsMapSecond(prevMap => new Map([...prevMap, ...arrayPointsMap]))
            }
        }

        // setUserPoints(userPoints + points)
        // // const copyPointsTable = [...userPointsTable]
        // // copyPointsTable.push(points)
        // // setUserPointsTable(copyPointsTable);
        // if (arrayPointsMap.size > 0) {
        //     setArrayPointsMap(prevMap => new Map([...prevMap, ...arrayPointsMap]))
        // }
        
        
 
    }, [changeId])

    useEffect(() => {
        

        
    }, [userPoints, arrayPointsMapState])

    useEffect(() => {
        socket.on('sendPointsToClient', ({ userPoints, arrayPointsMapJSON, toPlayer }) => {
            if (toPlayer === playerLoginx) {
                setUserPoints(prevPoints => userPoints + prevPoints)
                setArrayPointsMap(new Map(JSON.parse(arrayPointsMapJSON)))   
            } else if (toPlayer === secondLoginName) {
                setSecondUserPoints(prevPoints => secondUserPoints + prevPoints)
                setArrayPointsMapSecond(new Map(JSON.parse(arrayPointsMapJSON)))
            }})
            console.log("userPoints: got it", userPoints)
    
        return () => {
            socket.off('sendPointsToClient')
        }
    }, [userPoints, arrayPointsMapState])

    return (
        <div className={style['score-board']}>
            <div className={style['score-board-header']}>
                <span className={style['score-board-header-span']}>Tablica Wyników</span>
            </div>
            <div className={style['first-user']}>
                <div className={style['first-user-score']}>
                    <span className={style['first-username']}>Gracz 1: {firstUser}</span>
                    <span className={style['first-user-points']}>Suma: {userPoints}</span>
                </div>
                <div className={style['first-user-score-friction']}>
                    <span className={style['score-header']}>Punkty Cząstkowe</span>
                    {Array.from(arrayPointsMapState.entries()).map(([key, value], index) => (
                        <span key={index}>
                            {key.word} : {value}
                        </span>
                    ))}
                </div>
            </div>

            <div className={style['second-user']}>
                <div className={style['second-user-score']}>
                    <span className={style['second-username']}>Gracz 2: {secondUser}</span>
                    <span className={style['second-user-points']}>Suma: {secondUserPoints}</span>
                </div>
                <div className={style['second-user-score-friction']}>
                    <span className={style['score-header']}>Punkty Cząstkowe</span>
                    {Array.from(arrayPointsMapStateSecond.entries()).map(([key, value], index) => (
                        <span key={index}>
                            {key.word} : {value}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}