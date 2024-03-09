import react from 'react'

function ChatBlock() {
    return (
        <div className='chat-block'>
            <div className='chat-header'>
                <span className='span-chat-header'>
                    Czat
                </span>
            </div>
            <div className='message-container'>
                <div className='left-message'>
                    <span>Lorem ipsum test dolores agusia biedronusia Lorem ipsum test dolores agusia biedronusia</span>
                </div>
                <span className='left-message-info'>sotoran, data:  03.03.2024</span>
                <div className='right-message'>
                    <span>Lorem ipsum test dolores agusia biedronusia Lorem ipsum test dolores agusia biedronusia </span>
                </div>
                <span className='right-message-info'>
                    aga, data: 09.03.2024
                </span>
            </div>
            <div className='button-container'>
                <div className='writing-area'>
                    <input></input>
                </div>
                <div className='button-area'>
                    <button>Wyślij</button>
                </div>
            </div>
        </div>
    )
}

export default ChatBlock