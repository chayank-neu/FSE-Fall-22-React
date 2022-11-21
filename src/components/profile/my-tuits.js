import {useEffect, useState} from "react";
import * as service from "../../services/tuits-service";
import Tuits from "../tuits";


/**
 * @constructor MyTuits retrieves and displays a list of tuits posted by
 * the currently logged-in user; it renders as a tab under the profile
 * screen
 * @returns {JSX.Element}
 */
const MyTuits = () => {
    const [tuits, setTuits] = useState([]);
    const [tuit, setTuit] = useState('Hello');
    const findMyTuits = () =>
        service.findTuitByUser("me")
            .then(tuits => setTuits(tuits));
    const createTuit = () =>{
        const tt = {
            tuit: tuit
        }
        service.createTuit("me",tt )
                  .then((tuit) => {
                    findMyTuits()
                    console.log(tuit)
                })
                  .catch(e => alert(e));
                  
    }
    

    useEffect(() => {
        findMyTuits();
        return () => {
            setTuits({});
        };
    }, []);

    return(
        <div>
        <div className="border border-bottom-0">
        <h4 className="fw-bold p-2">Add tuits</h4>
        <div className="d-flex">
          <div className="p-2">
            <img className="ttr-width-50px rounded-circle"
                 src="../images/nasa-logo.jpg"/>
          </div>
          <div className="p-2 w-100">
            <textarea
              placeholder="What's happening?"
              className="w-100 border-0"
              onChange={(e) =>
                setTuit(e.target.value)}
              ></textarea>
            <div className="row">
                
                <div className="col-1">
                
              </div>
              <div className="col-2">
              <button className={`btn btn-primary rounded-pill fa-pull-right
                                fw-bold ps-4 pe-4`} onClick={createTuit} >Add</button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <Tuits tuits={tuits}
               refreshTuits={findMyTuits}/>
        </div>
        
        
    );
};

export default MyTuits;