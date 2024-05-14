import { useEffect } from 'react'
import { react, useState, useContext } from 'react'
import style from '../../css/Board/score_board.module.css'
import { SocketContext } from '../SocketProvider.jsx'

export const ScoreBoard = ({ points = 0 , arrayPointsMap, changeId, firstUser, secondUser, playerLogin }) => {
    const [ firstLoginName, setUsers ] = useState(firstUser)
    const [ secondLoginName, setSecondLoginName ] = useState(secondUser)
    const [ userPoints, setUserPoints] = useState(0)
    const [ secondUserPoints, setSecondUserPoints ] = useState(0)
    const [ userPointsTable, setUserPointsTable ] = useState([])
    const [ arrayPointsMapState, setArrayPointsMap ] = useState(new Map())
    const [ arrayPointsMapStateSecond, setArrayPointsMapSecond ] = useState(new Map())
    const [ playerLoginx, setPlayerLogin ] = useState(playerLogin)
    const socket = useContext(SocketContext)

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

    useEffect(() => {
        const arrayPointsMapArray = Array.from(arrayPointsMapState.entries());
        const arrayPointsMapJSON = JSON.stringify(arrayPointsMapArray)
        const toPlayer = playerLoginx === firstLoginName ? secondLoginName : firstLoginName
        socket.emit('sendPointsToServer', { userPoints, arrayPointsMapJSON, toPlayer})

        
    }, [userPoints, arrayPointsMapState])

    useEffect(() => {
        socket.on('sendPointsToClient', ({ userPoints, arrayPointsMapJSON, toPlayer }) => {
            console.log("POSZŁO")
            if (toPlayer !== playerLoginx) {
                setUserPoints(userPoints)
                setArrayPointsMap(new Map(JSON.parse(arrayPointsMapJSON)))
            }
        })
    
        return () => {
            socket.off('sendPointsToClient')
        }
    }, [])

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
                        <span className={style['first-username']}>Gracz 1: { firstLoginName }</span>
                        <span className={style['first-user-points']}>Suma: { userPoints }</span>
                    </div>
                    <div className={style['first-user-score-friction']}>
                        <span className={style['score-header']}>Punkty Cząstkowe</span>
                        {arrayPointsMapState.size > 0 && playerLogin === firstLoginName ? Array.from(arrayPointsMapState.entries()).map(([key, value], index) => (
                            <span key={index}>
                                {key.word} : {value}
                            </span>
                        )) : null }
                    </div>
                </div>

                <div className={style['second-user']}>
                    <div className={style['second-user-score']}>
                        <span className={style['second-username']}>Gracz 2: { secondLoginName }</span>
                        <span className={style['second-user-points']}>Suma: { secondUserPoints }</span>
                    </div>
                    <div className={style['second-user-score-friction']}>
                        <span className={style['score-header']}>Punkty Cząstkowe</span>
                        {arrayPointsMapStateSecond.size > 0 && arrayPointsMapStateSecond !== null ? Array.from(arrayPointsMapStateSecond.entries()).map(([key, value], index) => (
                            <span key={index}>
                                {key.word} : {value}
                            </span>
                        )) : null }
                    </div>
                </div>
            </div>
        </>
    )
}