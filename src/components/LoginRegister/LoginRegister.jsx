import React from "react"
import style from '../../css/LoginRegister/LoginRegister.module.css'

const LoginRegister = () => {
    return (
        <div className={style["main-container"]}>
            <div className={style["login-container"]}>
                <div className={style["login-header"]}>
                <span id="login-header-span">Liternik - logowanie</span> 
            </div>
            <div className={style["login-menu"]}>
                <form>
                    <div className={style["input-user-name-box"]}>
                        <input type="text" placeholder="Nazwa użytkownika" required />
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className={style["input-password-box"]}>
                        <input type="password" placeholder="Hasło" required />
                        <i className="fa-solid fa-lock"></i>
                    </div>
                </form>
            </div>
            <div className={style["button-container"]}>
                <button className={style["button-38"]} role="button" id="button-confirm">Wejdź do gry!</button>
            </div>
            <div className={style["register-message"]}>
                <a href="" id="register-message-id">Nie posiadasz konta? Załóż je natychmiast!</a>
            </div>
        </div>
        <div className={style["game-rules"]}>
            <div className={style["header"]}><span>Zasady gry</span></div>
                <ol className={style["list-rules"]}>
                    <li><span>Zasada pierwsza: zawsze sluchaj Hubisia.</span></li>
                    <li><span>Zasada druga: starannie przepisuj kod - nie kopiuj.</span></li>
                    <li><span>Zasada trzecia: lorem.</span></li>
                    <li><span>Zasada druga: ipsum.</span></li>
                    <li><span>Zasada druga: agusia.</span></li>
                    <li><span>Zasada druga: dolores.</span></li>
                    <li><span>Zasada druga: dolores biedronusias.</span></li>
                </ol>
                <div className={style["rules-footer"]}>
                    <span>Powodzenia!</span>
                </div>
            </div>
        </div>
    )
}

export default LoginRegister