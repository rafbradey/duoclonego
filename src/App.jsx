import {Routes, Route} from "react-router";

import Home from "./pages/Home/Home.jsx";
import Learn from "./pages/Learn/Learn.jsx";
import Practice from "./pages/Practice/Practice.jsx";
import Quests from "./pages/Quests/Quests.jsx";


import './App.css'
import Leaderboards from "./pages/Leaderboards/Leaderboards.jsx";
import Shop from "./pages/Shop/Shop.jsx";



function App() {


  return (
    <>

      <Routes>
        <Route path="" element={<Home/>}/>
        <Route path="/learn" element={<Learn/>}/>
          <Route path="/practice" element={<Practice/>}/>
          <Route path="/quests" element={<Quests/>}></Route>
          <Route path="/leaderboards" element={<Leaderboards/>}></Route>
          <Route path="/shop" element={<Shop/>}></Route>
          <Route path="/profile" element={<Shop/>}></Route>
      </Routes>
    </>
  )
}

export default App
