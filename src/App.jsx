import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from './components/Header'
import UserPanel from './components/UserPanel'
import Board from './components/Board'
import ScoreBoard from "./components/ScoreBoard"
import WordsBlock from "./components/WordsBlock"
import ChatBlock from "./components/ChatBlock"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = { <MainGamePage /> } />
      </Routes>
    </BrowserRouter>
  );
}

function MainGamePage() {
  return (
    <div className="App grid-container">
      <Header></Header>
      <UserPanel></UserPanel>
      <Board></Board>
      <ScoreBoard></ScoreBoard>
      <WordsBlock></WordsBlock>
      <ChatBlock></ChatBlock>
    </div>
  );
}

export default App
