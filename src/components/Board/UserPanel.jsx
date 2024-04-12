import { react, useState, useEffect } from 'react'
import style from '../../css/Board/user_panel.module.css'
import moment from 'moment'

function UserPanel() {
    const [ firstPlayerTime, setFirstPlayerTime ] = useState(null)

    const initiateTime = () => moment().set( { hour: 0, minute: 20, second: 0 } ) 

    useEffect(() => {
        setFirstPlayerTime(initiateTime())
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
                <p className={style['user-name-first']}>User 1</p>
                <p className={style['user-time-first']}>Czas: { firstPlayerTime !== null ? firstPlayerTime.format('mm:ss') : "Waiting" }</p>
            </div>
            <div className={style['user-info']}>
                <p className={style['user-name-second']}>User 2</p>
                <p className={style['user-time-second']}>Czas: 19:50</p>
            </div>
        </div>
    )
}

export default UserPanel