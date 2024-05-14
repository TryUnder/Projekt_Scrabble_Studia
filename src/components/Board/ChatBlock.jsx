import react from 'react'
import style from '../../css/Board/chat_block.module.css'
import { SocketContext } from '../SocketProvider.jsx'
import { useState, useContext, useEffect,useMemo } from 'react'
import { useLocation } from 'react-router-dom'

function ChatBlock() {
    const [message, setMessage] = useState('')
    const [chatHistory, setChatHistory] = useState([])
    const socket = useContext(SocketContext);
    const location = useLocation()
    const { login } = location.state
    const playerLogin = useMemo(() => login, [location.state])

    const sendMessage = () => {
        if(message.trim()){
            socket.emit('sendMessage', {message, playerLogin})
            setMessage('')
        }
    }


    useEffect(() => {
        socket.on('receiveMessage', (newMessage) => {
            setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [socket]);

    return (
        <div className={style['chat-block']}>
            <div className={style['chat-header']}>
                <span className={style['span-chat-header']}>
                    Czat
                </span>
            </div>
            <div className={style['message-container']}>
            {chatHistory.map((chatMessage, index) => (
                <div key={index} className={style[chatMessage.sender === playerLogin ? 'right-message' : 'left-message']}>
                    <span className={style['message-text']}>{chatMessage.text}</span>
                    <div className={style[chatMessage.sender === playerLogin ? 'right-message-info' : 'left-message-info']}>
                        {chatMessage.sender === playerLogin ? playerLogin : chatMessage.sender}, {chatMessage.date}
                    </div>
                </div>
                    
            ))}
        </div>
            
            <div className={style['button-container']}>
                <div className={style['writing-area']}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                </div>
                <div className={style['button-area']}>
                    <button className={style['button']} onClick={sendMessage}>Wyślij</button>
                </div>
            </div>
        </div>
    );
}

export default ChatBlock