import React from 'react';
import welcomeStyle from '../../css/WelcomePage/welcome_page.module.css';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
    return (
        <div className={welcomeStyle.background}>
            <div className={welcomeStyle.container}>
                <div className={welcomeStyle.content}>
                    <h1 className={welcomeStyle.heading}>Witaj w grze Liternik</h1>
                    <p className={welcomeStyle.paragraph}>Czy jesteś gotowy na słowotwórskie wyzwanie? Kliknij <a href="/login-register" className={welcomeStyle.link}>tutaj</a> aby zarejestrować się i zacząć grać!</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
