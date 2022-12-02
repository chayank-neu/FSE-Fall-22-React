import Tuit from "./tuit";
import {useEffect, useState} from "react";
import * as likesService from "../../services/likes-service";
import * as dislikesService from "../../services/dislikes-service";

const Tuits = ({tuits = [], deleteTuit,
                refreshTuits}) => {

  const likeTuit = (tuit) =>{
    console.log(tuit)
    likesService
      .userTogglesTuitLikes("me", tuit._id)
      .then(refreshTuits)
      .catch(e => alert(e))
  }

  const dislikeTuit = (tuit) =>{
    console.log(tuit)
    dislikesService
      .userTogglesTuitDislikes("me", tuit._id)
      .then(refreshTuits)
      .catch(e => alert(e))
  }
                   

  return (
    <div>
      <ul className="ttr-tuits list-group">
        {
          tuits.map && tuits.map(tuit =>
            <Tuit key={tuit._id}
              deleteTuit={deleteTuit}
              likeTuit={likeTuit}
              dislikeTuit={dislikeTuit}
              tuit={tuit}/>)
        }
      </ul>
    </div>
  );
}

export default Tuits;