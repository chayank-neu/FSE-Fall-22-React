import {useState} from "react";
import * as service
         from "../../services/auth-service";
import {HashRouter, Link, Route, Routes, useNavigate, useLocation} from "react-router-dom";

const Signup = () => {
  const [newUser, setNewUser] = useState({});
  const navigate = useNavigate();
  const signup = () =>
    service.signup(newUser)
      .then(() => navigate('/profile'))
      .catch(e => alert(e));
  return (
    <div>
      <h1>Signup</h1>
      <br/>
      <div class="form-group">
        <label for="usr">Username:</label>
        <input class="form-control" id={`usr`} onChange={(e) =>
        setNewUser({...newUser,
          username: e.target.value})}/>
      </div>
      <br/>
      <div className={`form-group`}>
        <label for="pwd">Password:</label>
        <input class="form-control" id={`pwd`} onChange={(e) =>
          setNewUser({...newUser,
          password: e.target.value})}/>
      </div>
      <br/>
      <div className={`form-group`}>
        <label for="email">Email address:</label>
        <input  className={`form-control`} id={`email`} onChange={(e) =>
        setNewUser({...newUser,
          email: e.target.value})}/>
      </div>
     <br/>
      <button className={`btn btn-primary`} onClick={signup}>
        SignUp</button>
        <br/>
        <br/>
      <Link className={`btn btn-primary`} to="/login">Go to Login</Link>
    </div>
  );
}
export default Signup;