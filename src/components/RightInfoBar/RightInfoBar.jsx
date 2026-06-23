import "./RightInfoBar.css";
import {useEffect, useState} from "react";
import {getUserInfo} from "../../services/userService.js";

import userAvatar from "../../assets/avatars/default_avatar_male.png";
import streakIcon from "../../assets/items/fire_streak.png";
import heartIcon from "../../assets/items/heart.png";
import diamondIcon from "../../assets/items/diamond.png";



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

                          <div className="user-brief-inner-info-container">
                          <div className="user-brief-profile">
                          <img src={userAvatar} alt="user_avatar"/>
                              <p className="body-text-light-sm">{user.display_name}</p>
                          </div>
                          <div className="user-brief-info">
                              <div className="user-stat">
                                  <img src={streakIcon} alt="" className="user-stat-icon" />
                                  <span className="body-text-light-sm">{user.streak}</span>
                              </div>

                              <div className="user-stat">
                                  <img src={heartIcon} alt="" className="user-stat-icon" />
                                  <span className="body-text-light-sm">{user.hearts}</span>
                              </div>

                              <div className="user-stat">
                                  <img src={diamondIcon} alt="" className="user-stat-icon" />
                                  <span className="body-text-light-sm">{user.diamonds}</span>
                              </div>
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