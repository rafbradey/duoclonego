import {Routes, Route} from "react-router";
import Home from "./pages/Home/Home.jsx";
import Navbar from "./components/Navbar/Navbar.jsx"

import './App.css'


function App() {


  return (
    <>
    <Navbar />
      <Routes>
        <Route path="" element={<Home/>}/>
      </Routes>
    </>
  )
}

export default App
