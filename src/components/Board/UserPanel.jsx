import react from 'react'
import style from '../../css/Board/user_panel.module.css'

function UserPanel() {
    return(
        <div className={style['user-panel']}>
            <div className={style['user-info']}>
                <p className={style['user-name-first']}>User 1</p>
                <p className={style['user-time-first']}>Czas: 20:00</p>
            </div>
            <div className={style['user-info']}>
                <p className={style['user-name-second']}>User 2</p>
                <p className={style['user-time-second']}>Czas: 19:50</p>
            </div>
        </div>
    )
}

export default UserPanel