import style from '../../css/UserProfile/UserProfile.module.css'
import axios from 'axios'

const UserProfile = () => {

    const handleLogout = async (event) => {
        event.preventDefault();

        const cookies = document.cookie.split(';').map(cookie => cookie.trim())
        const tokenCookie = cookies.find(cookie => cookie.startsWith('token='))
        //console.log(tokenCookie)
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenCookie}`;

        try {
            const response = await axios.post('/api/logout')
            console.log("pomyślnie wylogowano")
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            //window.location.reload();
        } catch (error) {
            console.log("Błąd podczas wylogowania", error)
        }

    }

    return (
        <div className={style["main-container"]}>
            <div className={style["player-panel"]}>
                <div className={style["player-panel-header"]}>
                    <span>Witaj <i className={style["fa-regular fa-face-smile"]}></i>nazwagracza</span>
                </div>
                <div className={style["date-sign-in"]}>
                    <span>Konto utworzone dnia: 16.03.2024</span>
                </div>
                <div className={style["player-panel-stats"]}>
                    <div className={style["all-player-games"]}>
                        <span>Liczba rozegranych partii: 200</span>
                    </div>
                    <div className={style["player-stats"]}>
                        <div className={style["all-games"]}>
                            <div className={style["all-games-header"]}>
                                Ukończone gry
                            </div>
                            <span>169</span>
                        </div>
                        <div className={style["won-games"]}>
                            <div className={style["won-games-header"]}>
                                Wygrane
                            </div>
                            <span>100</span>
                        </div>
                        <div className={style["lose-games"]}>
                            <div className={style["lose-games-header"]}>
                                Przegrane
                            </div>
                            <span>69</span>
                        </div>
                        {/* <div className={style["button-logout"]}>
                            <button type="submit" role="button" id="button-logout" onClick={handleLogout}></button>
                        </div> */}
                    </div>
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
                    <div>
                        <button onClick={handleLogout}>Wyloguj</button>
                    </div>
                </div>
                <div className={style["available-players-panel"]}>
                    <div className={style["panel-header"]}>
                        <span>Dostępni gracze</span>
                    </div>
                    <div className={style["available-players-list"]}>
                        <fieldset>
                            <legend>Wybierz użytkownika, z którym chcesz się zmierzyć:</legend>
                            <div>
                                <input type='radio' id="player-1" name='player' value="player-1" />
                                <label>Agusia Biedronusia</label>
                            </div>
                            <div>
                                <input type="radio" id="player-2" name="player" value="player-2" />
                                <label>AgusiaBiedronusia2</label>
                            </div>
                            <div>
                                <input type='radio' id="player-1" name='player' value="player-1" />
                                <label>Agusia Biedronusia</label>
                            </div>
                            <div>
                                <input type="radio" id="player-2" name="player" value="player-2" />
                                <label>AgusiaBiedronusia2</label>
                            </div>
                            <div>
                                <input type='radio' id="player-1" name='player' value="player-1" />
                                <label>Agusia Biedronusia</label>
                            </div>
                            <div>
                                <input type="radio" id="player-2" name="player" value="player-2" />
                                <label>AgusiaBiedronusia2</label>
                            </div>
                            <div>
                                <input type='radio' id="player-1" name='player' value="player-1" />
                                <label>Agusia Biedronusia</label>
                            </div>
                            <div>
                                <input type="radio" id="player-2" name="player" value="player-2" />
                                <label>AgusiaBiedronusia2</label>
                            </div>
                            <div>
                                <input type='radio' id="player-1" name='player' value="player-1" />
                                <label>Agusia Biedronusia</label>
                            </div>
                            <div>
                                <input type="radio" id="player-2" name="player" value="player-2" />
                                <label>AgusiaBiedronusia2</label>
                            </div>
                            <div>
                                <input type='radio' id="player-1" name='player' value="player-1" />
                                <label>Agusia Biedronusia</label>
                            </div>
                            <div>
                                <input type="radio" id="player-2" name="player" value="player-2" />
                                <label>AgusiaBiedronusia2</label>
                            </div>
                            <div>
                                <input type='radio' id="player-1" name='player' value="player-1" />
                                <label>Agusia Biedronusia</label>
                            </div>
                            <div>
                                <input type="radio" id="player-2" name="player" value="player-2" />
                                <label>AgusiaBiedronusia2</label>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile;