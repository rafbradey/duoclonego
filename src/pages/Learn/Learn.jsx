import "./Learn.css";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import RightInfoBar from "../../components/RightInfoBar/RightInfoBar.jsx";


function Learn(){
    return(
        <div className="page-wrapper">
            <div className="app-layout">
            <Sidebar/>
            </div>


            <div className="learn-page-content">
                <p></p>
            </div>
            <div className="right-info-bar-learn">
                <RightInfoBar/>
            </div>
        </div>
    )
}

export default Learn;