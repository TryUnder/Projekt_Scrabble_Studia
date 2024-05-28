import style from '../../css/UserProfile/UserProfile.module.css'
import axios from 'axios'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../SocketProvider.jsx'

export const getTokenCookie = () => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));

    if (tokenCookie) {
        return tokenCookie.split('=')[1];
    }
    return null;
}

export const getUserIdCookie = () => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const idCookie = cookies.find(cookie => cookie.startsWith('id='));
    const cookie = idCookie.split('=')[1]
    if (idCookie) {
        const cookieDecoded = JSON.parse(decodeURIComponent(cookie).substring(2))
        const userId = cookieDecoded[0].id
        return userId
    }
    return null;
}

const UserProfile = () => {
    const [ userInfo, setUserInfo ] = useState(null)
    const [ loggedInUsers, setLoggedInUsers ] = useState([])
    const [ languageSelect, setLanguageSelect ] = useState(null)
    const [ timeSelect, setTimeSelect ] = useState(null)
    const [ boardSelect, setBoardSelect ] = useState(null)
    const [ playerSelect, setPlayerSelect ] = useState(null)
    const socket = useContext(SocketContext)
    const navigate = useNavigate()

    useEffect(() => {
        const getUserInfo = async() => {
            try {
                const response = await axios.get("/api/getUserData", {
                    headers: {
                        Authorization: `Bearer ${getTokenCookie()}`
                    },
                    params: {
                        userId: getUserIdCookie()
                    }
                    
                });
                setUserInfo(response.data[0])
            } catch (error) {
                console.error("Błąd na etapie pobierania danych użytkownika (front-end). ", error)
            }
        }
        const token = getTokenCookie()
        const userId = getUserIdCookie()
        if (token && userId) {
            getUserInfo();
        }
    }, [])

    const handleLogout = async (event) => {
        event.preventDefault();

        const tokenCookie = getTokenCookie();
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenCookie}`;

        try {
            const response = await axios.post('/api/logout')
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            socket.emit('userLogout', userInfo.Login)
            document.location.reload();
        } catch (error) {
            console.error("Błąd podczas wylogowania", error)
        }
    }

    const handleGameStart = async (event) => {
        event.preventDefault();

        if (languageSelect === null || languageSelect === '' ||
            timeSelect === null || timeSelect === '' ||
            boardSelect === null || boardSelect === '' || 
            playerSelect === null || playerSelect === '') {
            alert("Nie wybrano wszystkich opcji")
            return
        } 

        socket.emit('gameRequest', { language: languageSelect, time: timeSelect, board: boardSelect, 
            receiverPlayer: playerSelect, senderPlayer: userInfo.Login})
    }

    const acceptRejectProposal = (receiverPlayer, senderPlayer, time) => {
        if (!userInfo) {
            console.error("UserInfo is null");
            return;
        }
    
        const confirm = window.confirm(`Czy chcesz rozpocząć grę z użytkownikiem: ${senderPlayer} ?`);
        if (!confirm) {
            return;
        }

        socket.emit("acceptedProposal", { receiverPlayer: receiverPlayer, senderPlayer: senderPlayer, time: time });

        const login = userInfo.Login;
        navigate("/game", { state: { receiverPlayer, senderPlayer, time, login }});
    };

    const senderPlayerNavigate = (receiverPlayer, senderPlayer, time) => {
        const login = userInfo.Login;
        navigate("/game", { state: { receiverPlayer, senderPlayer, time, login }})
    }

    useEffect(() => {
        if (socket) {
            socket.on('loggedInUsers', (users) => {
                setLoggedInUsers(users.filter(user => user !== userInfo?.Login));
            });

            return () => {
                socket.off('loggedInUsers');
            }
        }
    }, [socket, userInfo]);

    useEffect(() => {
        if (socket && userInfo) {
            socket.emit('userLogin', userInfo.Login);

            return () => {
                socket.emit('userLogout', userInfo.Login);
            }
        }
    }, [socket, userInfo]);

    useEffect(() => {
        if (socket) {
            socket.on('gameAccept', ({ language, time, board, receiverPlayer, senderPlayer }) => {
                acceptRejectProposal(receiverPlayer, senderPlayer, time);
            });
    
            socket.on('senderPlayerNavigate', ({ receiverPlayer, senderPlayer, time }) => {
                senderPlayerNavigate(receiverPlayer, senderPlayer, time);
            });
    
            return () => {
                socket.off('gameAccept');
                socket.off('senderPlayerNavigate');
            };
        }
    }, [socket, userInfo]);
    
    return (
        <div className={style["main-container"]}>
            <div className={style["player-panel"]}>
                <div className={style["player-panel-header"]}>
                    <span>Witaj <i className={style["fa-regular fa-face-smile"]}></i>{ userInfo ? userInfo.Login : "Ładowanie" }</span>
                </div>
                <div className={style["date-sign-in"]}>
                    <span>Konto utworzone dnia: { userInfo ? moment(userInfo.CreationDate).format('DD-MM-YYYY') : "Ładowanie" }</span>
                </div>
                <div className={style["player-panel-stats"]}>
                    <div className={style["all-player-games"]}>
                        <span>Rozegrano: { userInfo ? userInfo.LiczbaRozegranychPartii : "Ładowanie" } gier</span>
                    </div>
                    <div className={style["player-stats"]}>
                        <div className={style["all-games"]}>
                            <div className={style["all-games-header"]}>
                                Remisy
                            </div>
                            <span>{ userInfo ? userInfo.ZremisowaneGry : "Ładowanie" }</span>
                        </div>
                        <div className={style["won-games"]}>
                            <div className={style["won-games-header"]}>
                                Wygrane
                            </div>
                            <span>{ userInfo ? userInfo.WygraneGry : "Ładowanie"}</span>
                        </div>
                        <div className={style["lose-games"]}>
                            <div className={style["lose-games-header"]}>
                                Przegrane
                            </div>
                            <span>{ userInfo ? userInfo.PrzegraneGry : "Ładowanie" }</span>
                        </div>
                    </div>
                </div>
                <div className={style["button-logout"]}>
                    <button type="submit" role="button" id="button-logout" className={style["button-5"]} onClick={handleLogout}>Wyloguj</button>
                </div>
            </div>
            <div className={style["game-panel"]}>
                <div className={style["create-game-panel"]}>
                    <div className={style["create-game-header"]}>
                        <span>Stwórz rozgrywkę</span>
                    </div>
                    <div className={style["create-game-menu"]}>
                        <div className={style["language-menu"]}>
                            <label>Wybierz język gry</label>
                            <select 
                                name="language" 
                                id="language-select" 
                                className={style["language-menu-select"]}
                                onChange={e => {setLanguageSelect(e.target.value)}}
                                >
                                    <option value=""> </option>
                                    <option value="Polski">Polski</option>
                            </select>
                        </div>
                        <div className={style["time-menu"]}>
                            <label>Wybierz czas trwania gry:</label>
                            <select 
                                name = "time" 
                                id = "time-select" 
                                className = {style["time-menu-select"]}
                                onChange = {e => {setTimeSelect(e.target.value)}}
                                >
                                    <option value=""> </option>
                                    <option value = "30 seconds">30 sekund</option>
                                    <option value = "3 minutes">3 minuty</option>
                                    <option value = "6 minutes">6 minut</option>
                                    <option value = "9 minutes">9 minut</option>
                                    <option value = "15 minutes">15 minut</option>
                                    <option value = "30 minutes">30 minut</option>
                            </select>
                        </div>
                        <div className={style["board-menu"]}>
                            <label>Wybierz planszę:</label>
                            <select 
                                name="board" 
                                id="board-select" 
                                className={style["board-menu-select"]}
                                onChange={e => {setBoardSelect(e.target.value)}}
                                >
                                    <option value=""> </option>
                                    <option value="Standardowa">Standardowa</option>
                            </select>
                        </div>
                    </div>
                    <div className={style["create-game-button"]}>
                        <button 
                            className={style["button-4"]} 
                            role="button"
                            onClick={(event) => handleGameStart(event)}
                            >Rozpocznij grę</button>
                    </div>
                </div>
                <div className={style["available-players-panel"]}>
                    <div className={style["panel-header"]}>
                        <span>Dostępni gracze</span>
                    </div>
                    <div className={style["available-players-list"]}>
                        <fieldset>
                            <legend>Wybierz użytkownika, z którym chcesz się zmierzyć:</legend>
                            {loggedInUsers.map((user, index) => (
                                <div>
                                    <input type='radio' id={index}
                                        value={user}
                                        name='player-select'
                                        onChange={e => setPlayerSelect(e.target.value)}
                                    ></input>
                                    <label>{user ? user : null}</label>
                                </div>
                            ))}
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile;