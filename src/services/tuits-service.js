/**
 * @file the tuits service interacts with session API and accesses the
 * tuits RESTful web API
 */
 import axios from "axios";
 const BASE_URL = process.env.REACT_APP_BASE_URL;
 const TUITS_API = `${BASE_URL}/tuits`;
 const USERS_API = `${BASE_URL}/users`;
 
 const api = axios.create({
     withCredentials: true
 });

 export const findAllTuits = () =>
  axios.get(TUITS_API)
    .then(response => response.data);
 
 export const findTuitByUser = (uid) =>
     api.get(`${USERS_API}/${uid}/tuits`)
         .then(response => response.data);
 
 export const createTuit = (uid, tuit) =>
     api.post(`${USERS_API}/${uid}/tuits`, tuit)
         .then(response => response.data);

export const deleteTuit = (tid) =>
    api.delete(`${TUITS_API}/${tid}`)
             .then(response => response.data);

export const findTuitById = (tid) =>
    api.get(`${TUITS_API}/${tid}`)
                 .then(response => response.data);