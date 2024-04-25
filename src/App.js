import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage";
import Lobby from "./Components/Lobby";
import Room from "./Components/Room";


function App() {
  return (
      <>
      <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/lobby" element={<Lobby/>}/>
      <Route path="/room/:room" element={<Room/>}/>
      </Routes>
      </>
  );
}

export default App;
