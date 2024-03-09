import react from 'react'

function UserPanel() {
    return(
        <div className='user-panel'>
            <div className='user-info'>
                <p className='user-name-first'>Gracz 1: User 1</p>
                <p className='user-time-first'>Pozostało czasu: 20:00</p>
            </div>
            <div className='user-info'>
                <p className='user-name-second'>Gracz 2: User 2</p>
                <p className='user-time-second'>Pozostało czasu: 19:50</p>
            </div>
        </div>
    )
}

export default UserPanel