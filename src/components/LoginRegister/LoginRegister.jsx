import React from "react"
import axios from 'axios'
import style from '../../css/LoginRegister/LoginRegister.module.css'
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const LoginRegister = () => {
    const navigate = useNavigate();

    const [ currentPageState, setPageState ] = useState({
        headerName : "Liternik - rejestracja",
        loginPageState : "Posiadsz konto? Zaloguj się!",
        buttonState : "Zarejestruj",
    });

    const [ formData, setFormData] = useState({
        login: "",
        password: ""
    })

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const validateLogin = () => {
        const regexLogin = /^[a-zA-Z0-9]{6,}$/
            if (regexLogin.test(formData.login)) {
                return true
            }
            else {
                return false
            }
    }

    const validatePassword = () => {
        const regexPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W)[a-zA-Z0-9\W]{6,}/
        if (regexPassword.test(formData.password)) {
            return true
        } else {
            return false
        }
    }

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!validateLogin()) {
                throw "Błędny login"
            } 

        } catch (error) {
            alert("Nazwa użytkownika nie spełnia wymagań. Login powinien składać się z min. 6 znaków.", error)
            return null
        }

        try {
            if (!validatePassword()) {
                throw "Błędne hasło"
            }
        } catch (error) {
            alert("Hasło użytkownika nie spełnia wymagań. Hasło powinno składać się z minimum 6 znaków (w tym: 1 małej litery, 1 dużej litery, 1 cyfry, 1 znaku specjalnego.")
            return null
        }
        
        try {
            const response = await axios.post('/api/register', formData)
            alert("Konto zostało pomyślnie utworzone.")
            setFormData({
                login: "",
                password: ""
            });
        } catch (error) {
            console.error("Błąd podczas wysyłania danych do backendu (rejestracja): ", error)
            alert("Podany login został już wykorzystany.")
            document.location.reload()
        }
    }

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/login', formData)

            setFormData({
                login: "",
                password: ""
            });

            navigate("/user-profile")
        } catch (error) {
            console.error("Błąd podczas wysyłania danych do backendu (logowanie): ", error)
            if (error.response && error.response.status === 401) {
                alert("Błędny login lub hasło.")
            } else {
                alert("Wystąpił błąd podczas logowania. Spróbuj ponownie.")
            }
            document.location.reload()
        }
    }

    const changeLoginState = (event) => {
        event.preventDefault()
        const loginHeaderName = currentPageState.headerName === "Liternik - rejestracja" ? "Liternik - logowanie" : "Liternik - rejestracja"
        const loginChangeState = currentPageState.loginPageState === "Posiadsz konto? Zaloguj się!" ? "Nie posiadasz konta? Zarejestruj się!" : "Posiadsz konto? Zaloguj się!"
        const changeButtonState = currentPageState.buttonState === "Zarejestruj" ? "Wejdź do gry" : "Zarejestruj"

        setPageState({
            headerName: loginHeaderName,
            loginPageState: loginChangeState,
            buttonState: changeButtonState
        })
    }

    const handleDisplayRules = (event) => navigate("/extended-rules")

    return (
        <div className={style["main-container"]}>
            <div className={style["login-container"]}>
                <div className={style["login-header"]}>
                <span id="login-header-span">{currentPageState.headerName}</span> 
            </div>
            <div className={style["login-menu"]}>
                <form onSubmit={ currentPageState.buttonState === "Zarejestruj" ? handleRegisterSubmit : handleLoginSubmit}>
                    <div className={style["input-user-name-box"]}>
                        <input type="text" name="login" value={formData.login} onChange={handleChange} placeholder="Nazwa użytkownika" required />
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className={style["input-password-box"]}>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Hasło" required />
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <div className={style["button-container"]}>
                        <button type="submit" className={style["button-38"]} role="button" id="button-confirm">{currentPageState.buttonState}</button>
                    </div>
                </form>
            </div>
            <div className={style["register-message"]}>
                <a onClick={changeLoginState} id="register-message-id">{currentPageState.loginPageState}</a>
            </div>
        </div>
        <div className={style["game-rules"]}>
            <div className={style["header"]}><span>Zasady gry</span></div>
                <ol className={style["list-rules"]}>
                    <li><span>Układaj słowa i zyskuj punkty w zależności od ilości kafelków stanowiących słowo.</span></li>
                    <li><span>Każda litera odpowiada innej liczbie punktów.</span></li>
                    <li><span>Na planszy znajdują się kolorowe pola premiowe, zwiększające wartość punktową za układane słowa.</span></li>
                    <li><span>Układaj wyrazy przechodzące przez pola x2 i x3, które zapewniają premię na cały wyraz.</span></li>
                    <li><span>Pierwszy wyraz musi przechodzić przed środek kafelek planszy.</span></li>
                    <li><span>Rywalizuj z drugim graczem na czas. Wygrywa ten, kto zdobędzie więcej punktów.</span></li>
                    <a onClick={handleDisplayRules} className={style["text-decoration"]}>Wyświetl zasady szczegółowe</a>
                </ol>
                <div className={style["rules-footer"]}>
                    <span>Powodzenia!</span>
                </div>
            </div>
        </div>
    )
}

export default LoginRegister