import {HashRouter, Link, Route, Routes, useNavigate, useLocation} from "react-router-dom";
import {useState} from "react";
import * as service from "../../services/auth-service"

export const Login = () => {
  const [loginUser, setLoginUser] = useState({});
  const navigate = useNavigate()
  const login = () =>
    service.login(loginUser)
      .then((user) => navigate('/profile/mytuits'))
      .catch(e => alert(e));
  return (
    <div>
      <h1>Login</h1>
      <br/>
      <div class="form-group">
        <label for="usr">Username:</label>
        <input class="form-control" id={`usr`} onChange={(e) =>
        setLoginUser({...loginUser,
          username: e.target.value})}/>
      </div>
      <br/>
      <div className={`form-group`}>
        <label for="pwd">Password:</label>
        <input class="form-control" id={`pwd`} onChange={(e) =>
        setLoginUser({...loginUser,
          password: e.target.value})}/>
      </div>
      <br/>
      <button className={`btn btn-primary`} onClick={login}>
        Login</button>
        <br/>
        <br/>
      <Link className={`btn btn-primary`} to="/signup">Go To SignUp</Link>
    </div>
  );
};
