import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from './components/Board/Header'
import UserPanel from './components/Board/UserPanel'
import Board from './components/Board/Board'
import ScoreBoard from "./components/Board/ScoreBoard"
import WordsBlock from "./components/Board/WordsBlock"
import ChatBlock from "./components/Board/ChatBlock"
import LoginRegister from "./components/LoginRegister/LoginRegister"

import styleMainView from './css/Board/style_main_view.module.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = { <MainGamePage /> } />
        <Route path="/start" element = { <LoginRegister /> } />
      </Routes>
    </BrowserRouter>
  );
}

function MainGamePage() {
  return (
    <div className="App">
          <div className={styleMainView["grid-container"]}>
              <Header></Header>
              <UserPanel></UserPanel>
              <Board></Board>
              <WordsBlock></WordsBlock>
              <ScoreBoard></ScoreBoard>
              <ChatBlock></ChatBlock>
          </div>
    </div>
  );
}

export default App
