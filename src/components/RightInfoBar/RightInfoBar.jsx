import "./RightInfoBar.css";
import {useEffect, useState} from "react";
import {getUserInfo} from "../../services/userService.js";



function RightInfoBar(){

    const [users, setUserInfo] = useState([]);
    useEffect(() => {
            async function loadUserInfo(){
                const data = await getUserInfo();
                setUserInfo(data);
            }
            loadUserInfo();
        },
        []);

    return(
        <>
            <div className="right-info-main default-bg">
              <div className="user-brief-info-container">
                  {users.map((user) =>(
                      <div key={user.id}>
                          <div className="test">
                          <div className="user-brief-profile">
                          <img src={user.avatar} alt="user_avatar"/>
                              <p>{user.display_name}</p>
                          </div>
                          <div className="user-brief-info">
                              <p>Streak: {user.streak}</p>
                              <p>Lives: {user.hearts}</p>
                          </div>
                      </div>
                      </div>
                  ))}

              </div>


            </div>
        </>
    )
}

export default RightInfoBar;