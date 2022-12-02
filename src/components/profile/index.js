import React, {useEffect, useState} from "react";
import {HashRouter, Link, Route, Routes, useNavigate, useLocation} from "react-router-dom";
import * as service from "../../services/auth-service"
import MyTuits from "./my-tuits";
import MyLikes from "./my-likes";
import MyDislikes from "./my-dislikes.js";



/**
 * @constructor Profile uses the profile client service to adapt to the user interface
 * based on login information.
 * @returns {JSX.Element}
 *
 */
const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  useEffect(async () => {
    try {
      const user = await service.profile();
      setProfile(user);
    } catch (e) {
      navigate('/login');
    }
  }, []);
  const logout = () => {
    service.logout()
      .then(() => navigate('/login'));
  }

  const mytuits = () => {
    navigate('/mytuits')
  }
  return(
    <div className="row">
      <h4>{profile.username}</h4>
      <h6>@{profile.username}</h6>
      <br/>
      <div className="row">
        <div className="col">
        <Link className={`btn btn-primary rounded-pill fw-bold`} to="/profile/mytuits"> Tuits</Link>
        </div>
        <div className="col">
        <Link className={`btn btn-primary rounded-pill fw-bold`} to="/profile/mylikes"> Likes</Link>
        </div>
        <div className="col">
        <Link className={`btn btn-primary rounded-pill fw-bold`} to="/profile/mydislikes"> Dislikes</Link>
        </div>
        <div className="col">
        <Link className={`btn btn-danger rounded-pill fw-bold`} onClick={logout}>Logout</Link>
        </div>
      </div>
      <div className="row"><br/></div>
      
        <Routes>
        <Route path="/mytuits"
               element={<MyTuits/>}/>
        <Route path="/mylikes"
               element={<MyLikes/>}/>
        <Route path="/mydislikes" 
               element={<MyDislikes/>}/>
        {/* <Route path="/tuits-and-replies"
               element={<TuitsAndReplies/>}/>
        <Route path="/media"
               element={<Media/>}/>
        <Route path="/mylikes"
               element={<MyLikes/>}/> */}
      </Routes>
    </div>
  );
};


export default Profile;