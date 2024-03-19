import react from 'react'
import style from '../../css/Board/chat_block.module.css'

function ChatBlock() {
    return (
        <div className={style['chat-block']}>
            <div className={style['chat-header']}>
                <span className={style['span-chat-header']}>
                    Czat
                </span>
            </div>
            <div className={style['message-container']}>
                <div className={style['left-message']}>
                    <span>Lorem ipsum test dolores agusia biedronusia Lorem ipsum test dolores agusia biedronusia</span>
                </div>
                <span className={style['left-message-info']}>sotoran, data:  03.03.2024</span>
                <div className={style['right-message']}>
                    <span>Lorem ipsum test dolores agusia biedronusia Lorem ipsum test dolores agusia biedronusia </span>
                </div>
                <span className={style['right-message-info']}>
                    aga, data: 09.03.2024
                </span>
            </div>
            <div className={style['button-container']}>
                <div className={style['writing-area']}>
                    <input></input>
                </div>
                <div className={style['button-area']}>
                    <button className={style['button']}>Wyślij</button>
                </div>
            </div>
        </div>
    )
}

export default ChatBlock