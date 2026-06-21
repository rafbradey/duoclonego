import {Routes, Route} from "react-router";
import Home from "./pages/Home/Home.jsx";
import Navbar from "./components/Navbar/Navbar.jsx"

import './App.css'


function App() {


  return (
    <>

      <Routes>
        <Route path="" element={<Home/>}/>
        <Route path="/practice" element={<Home/>}/>
      </Routes>
    </>
  )
}

export default App
