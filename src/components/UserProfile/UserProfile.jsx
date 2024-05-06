import style from '../../css/UserProfile/UserProfile.module.css'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import ClientComponent from '../UserProfile/ClientComponent'
import io from 'socket.io-client'

const getTokenCookie = () => {
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

    useEffect(() => {
        const socket = io()

        socket.on('loggedInUsers', (users) => {
            console.log("Załadowane dane użytkowników: ", users)
            const filteredUsers = users.filter(user => user !== userInfo.Login)
            setLoggedInUsers(filteredUsers)
        })

        return () => socket.close()
    })

    const handleLogout = async (event) => {
        event.preventDefault();

        const tokenCookie = getTokenCookie();
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenCookie}`;

        try {
            const response = await axios.post('/api/logout')
            console.log("pomyślnie wylogowano")
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.location.reload();
        } catch (error) {
            console.log("Błąd podczas wylogowania", error)
        }

    }

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
                                Ukończone gry
                            </div>
                            <span>{ userInfo ? userInfo.UkonczoneGry : "Ładowanie" }</span>
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
                            <select name="language" id="language-select" className={style["language-menu-select"]}>
                                <option value="     "> </option>
                                <option value="Polski"></option>
                                <option value="Angielski">Angielski</option>
                            </select>
                        </div>
                        <div className={style["time-menu"]}>
                            <label>Wybierz czas trwania gry:</label>
                            <select name="time" id="time-select" className={style["time-menu-select"]}>
                                <option value="     "> </option>
                                <option value="3-min">3 minuty</option>
                                <option value="6-min">6 minut</option>
                                <option value="9-min">9 minut</option>
                                <option value="15-min">15 minut</option>
                            </select>
                        </div>
                        <div className={style["board-menu"]}>
                            <label>Wybierz planszę:</label>
                            <select name="board" id="board-select" className={style["board-menu-select"]}>
                                <option value="     "> </option>
                                <option value="Standardowa">Standardowa</option>
                                <option value="Niestandardowa">Niestandardowa</option>
                                <option value="Bez-premii">Bez premii</option>
                            </select>
                        </div>
                    </div>
                    <div className={style["create-game-button"]}>
                        <button className={style["button-4"]} role="button">Rozpocznij grę</button>
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
                                    <input type='radio' id={index}></input>
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