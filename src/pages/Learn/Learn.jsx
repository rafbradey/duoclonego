import "./Learn.css";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import RightInfoBar from "../../components/RightInfoBar/RightInfoBar.jsx";
import {ArrowLeft, NotebookText} from "lucide-react";

import {useEffect, useState} from "react";
import {getLessons} from "../../services/unitService.js";


function Learn(){

    const [units,setLessons] = useState([]);

    useEffect( () => {
            async function loadLessons() {
                const data = await getLessons();
                setLessons(data);
            }
            loadLessons();
        },[]);

    return(
        <div className="page-wrapper">
            <div className="app-layout">
            <Sidebar/>
            </div>

            <div className="learn-page-content">
                <div className="learn-page-unit-container">
                {units.map((unit) =>(
                    <div key={unit.id}>

                        <div className="learn-page-inner-unit-container">
                            <div className="learn-title-unit-container">
                            <div className="unit-header-txt">
                        <div><ArrowLeft size={24}/></div>
                        <h2 className="body-text-light-md">{unit.title}</h2>
                            </div>
                            <div className="unit-subheader-txt">
                        <p className="body-text-light-bold-lg">{unit.description}</p>
                            </div>
                            </div>


                            
                            <div className="unit-guidebook body-text-light-sm"><NotebookText size={24}/>GUIDEBOOK</div>
                        </div>


                        <p>----END OF LESSON----- ?</p>
                    </div>



                ))}
            </div>
            </div>
            <div className="right-info-bar-learn">
                <RightInfoBar/>
            </div>
        </div>
    )
}

export default Learn;