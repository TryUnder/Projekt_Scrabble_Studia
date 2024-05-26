import { useState, useEffect } from 'react';
import style from '../../css/Board/user_panel.module.css';
import moment from 'moment';

function UserPanel({ receiverPlayer, senderPlayer, time, playerLogin, turn, socket }) {
    const [firstUserName] = useState(receiverPlayer);
    const [secondUserName] = useState(senderPlayer);
    const [firstPlayerTime, setFirstPlayerTime] = useState(null);
    const [secondPlayerTime, setSecondPlayerTime] = useState(null);
    const [activeTurn, setActiveTurn] = useState(turn);
    const [ firstPlayerTimeEnded, setFirstPlayerTimeEnded ] = useState(false);
    const [ secondPlayerTimeEnded, setSecondPlayerTimeEnded ] = useState(false);

    const initiateTime = (time) => {
        switch(time) {
            case "30 seconds": return moment().set({ hour: 0, minute: 0, second: 30 });
            case "3 minutes": return moment().set({ hour: 0, minute: 3, second: 0 });
            case "6 minutes": return moment().set({ hour: 0, minute: 6, second: 0 });
            case "9 minutes": return moment().set({ hour: 0, minute: 9, second: 0 });
            case "15 minutes": return moment().set({ hour: 0, minute: 15, second: 0 });
            case "30 minutes": return moment().set({ hour: 0, minute: 30, second: 0 });
            default: return moment().set({ hour: 0, minute: 15, second: 0 });
        }
    };

    useEffect(() => {
        if (!firstPlayerTimeEnded) {
            setFirstPlayerTime(initiateTime(time));
        }
        if (!secondPlayerTimeEnded) {
            setSecondPlayerTime(initiateTime(time));
        }
    }, [time]);

    useEffect(() => {
        setActiveTurn(turn);
    }, [turn]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (activeTurn === receiverPlayer && !firstPlayerTimeEnded) {
                setFirstPlayerTime((prevTime) => {
                    const updatedTime = moment(prevTime).subtract(1, 'second');
                    if (updatedTime.hours() === 0 && updatedTime.minutes() === 0 && updatedTime.seconds() === 0) {
                        clearInterval(timer);
                        setFirstPlayerTimeEnded(true);
                        socket.emit('timeEnded', { player: receiverPlayer })
                    }
                    return updatedTime;
                });
            } else if (activeTurn === senderPlayer && !secondPlayerTimeEnded) {
                setSecondPlayerTime((prevTime) => {
                    const updatedTime = moment(prevTime).subtract(1, 'second');
                    if (updatedTime.hours() === 0 && updatedTime.minutes() === 0 && updatedTime.seconds() === 0) {
                        clearInterval(timer);
                        setSecondPlayerTimeEnded(true);
                        socket.emit('timeEnded', { player: senderPlayer })
                    }
                    return updatedTime;
                });
            }
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [activeTurn, receiverPlayer, senderPlayer]);

    return (
        <div className={style['user-panel']}>
            <div className={`${style['user-info']} ${playerLogin === receiverPlayer ? style['active-player-bcg'] : ''}`}>
                <p className={style['user-name-first']}>{firstUserName}</p>
                <p className={style['user-time-first']}>Czas: {firstPlayerTime !== null ? firstPlayerTime.format('mm:ss') : "Waiting"}</p>
                <i className={`${'fa-solid fa-fire'} ${activeTurn === receiverPlayer ? style['active-player'] : style['non-active-player']}`}></i>
            </div>
            <div className={`${style['user-info']} ${playerLogin === senderPlayer ? style['active-player-bcg'] : ''}`}>
                <p className={style['user-name-second']}>{secondUserName}</p>
                <p className={style['user-time-second']}>Czas: {secondPlayerTime !== null ? secondPlayerTime.format('mm:ss') : "Waiting"}</p>
                <i className={`${'fa-solid fa-fire'} ${activeTurn === senderPlayer ? style['active-player'] : style['non-active-player']}`}></i>
            </div>
        </div>
    );
}

export default UserPanel;
