import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";

import Header from './components/Board/Header'
import UserPanel from './components/Board/UserPanel'
import Board from './components/Board/Board'
import ScoreBoard from "./components/Board/ScoreBoard"
import WordsBlock from "./components/Board/WordsBlock"
import ChatBlock from "./components/Board/ChatBlock"
import LoginRegister from "./components/LoginRegister/LoginRegister"
import UserProfile from './components/UserProfile/UserProfile'

import ExtendedRules from './components/LoginRegister/ExtendedRules'

import styleMainView from './css/Board/style_main_view.module.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/game" element = { <MainGamePage /> } />
          <Route path="/user-profile" element = { <UserProfile /> } />
        </Route>
        
        <Route path="/login-register" element = { <LoginRegister /> } />
        <Route path="/extended-rules" element = { <ExtendedRules /> } />
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
