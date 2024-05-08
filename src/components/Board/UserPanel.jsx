import { react, useState, useEffect } from 'react'
import style from '../../css/Board/user_panel.module.css'
import moment from 'moment'

function UserPanel({ receiverPlayer, senderPlayer, time}) {
    const [ firstUserName, setFirstUserName ] = useState(receiverPlayer)
    const [ secondUserName, setSecondUserName ] = useState(senderPlayer)
    const [ firstPlayerTime, setFirstPlayerTime ] = useState(null)
    const [ secondPlayerTime, setSecondPlayerTime ] = useState(null)

    const initiateTime = (time) => {
        switch(time) {
            case "3 minutes": {
                return moment().set( { hour: 0, minute: 3, second: 0 } )
            }
            case "6 minutes": {
                return moment().set( { hour: 0, minute: 6, second: 0 } )
            }
            case "9 minutes": {
                return moment().set( { hour: 0, minute: 9, second: 0 } )
            }
            case "15 minutes": {
                return moment().set( { hour: 0, minute: 15, second: 0 } )
            }
            case "30 minutes": {
                return moment().set( { hour: 0, minute: 30, second: 0 } )
            }
            default: {
                return moment().set( { hour: 0, minute: 15, second: 0 } )
            }
        }
    }

    useEffect(() => {
        setFirstPlayerTime(initiateTime(time))
        setSecondPlayerTime(initiateTime(time))
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            if (firstPlayerTime !== null) {
                const updatedTime = moment(firstPlayerTime)
                updatedTime.subtract(1, 'second')
                setFirstPlayerTime(updatedTime)
            }
        }, 1000)

        return() => {
            clearInterval(timer);
        }

    }, [firstPlayerTime])

    return(
        <div className={style['user-panel']}>
            <div className={style['user-info']}>
                <p className={style['user-name-first']}> { firstUserName }</p>
                <p className={style['user-time-first']}>Czas: { firstPlayerTime !== null ? firstPlayerTime.format('mm:ss') : "Waiting" }</p>
            </div>
            <div className={style['user-info']}>
                <p className={style['user-name-second']}> { secondUserName }</p>
                <p className={style['user-time-second']}>Czas: { secondPlayerTime !== null ? secondPlayerTime.format('mm:ss') : "Waiting" }</p>
            </div>
        </div>
    )
}

export default UserPanel