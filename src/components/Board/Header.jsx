import React from 'react'
import style from '../../css/Board/header.module.css'

function Header() {
    return (
        <header className={style['header']}>
            <p className={style['game-name']}>Liternik</p>
        </header>
    );
}

export default Header;