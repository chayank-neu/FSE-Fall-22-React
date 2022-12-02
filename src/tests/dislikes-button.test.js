/**
 * @jest-environment node
 */

 import {createUser, deleteUser} from "../services/users-service";
 import {createTuit, deleteTuit, findTuitByUser, findTuitById} from "../services/tuits-service";
 import {findAllTuitsDislikedByUser, userTogglesTuitDislikes} from "../services/dislikes-service";
 
 describe('updating tuits stats by dislike button', () => {
 
     // sample users we'll insert to then retrieve
     const usernames = [
        "karan", "suresh", "mahes"
     ];
 
     let nwUsers = [];
     let nwTuit = null;
 
     beforeAll(async () => {
        // insert all users
        nwUsers = await Promise.all(
            usernames.map(async (username) => {
                return await createUser({
                    username,
                    password: `${username}456`,
                    email: `${username}@gmail.com`
                })
            })
        )
    });
 
     afterAll(async () => {
         // remove all data created
         for (const user of nwUsers) {
             await userTogglesTuitDislikes(user._id, nwTuit._id);
         }
         await Promise.all(nwUsers.map(async (user) => {
             const tuits = await findTuitByUser(user._id);
             for (const tuit of tuits) {
                 await deleteTuit(tuit._id);
             }
             await deleteUser(user._id);
         }))
     })
 
     test('updating tuits stats by dislike button', async () => {
         // creating a tuit form first user
        const firstUser = nwUsers[0];
        nwTuit = await createTuit(firstUser._id, {
            tuit: `testing tuit by ${firstUser.username}`
        });
         
         // all users dislike the new tuit
         for (const newUser of nwUsers) {
             await userTogglesTuitDislikes(newUser._id, nwTuit._id);
         }
 
         // retreive all tuits disliked by user
         const allDislikedTuitsByUser = await findAllTuitsDislikedByUser(firstUser._id);
         
         const filteredTuits = allDislikedTuitsByUser.filter(tuit => tuit._id === nwTuit._id);
         
         // check if filtered tuits is same as tutis created by user
         expect(filteredTuits.length).toEqual(1);

         const tuitStats = await findTuitById(nwTuit._id)
 
         // compare the no of likes for tuit
         expect(tuitStats.stats.dislikes).toEqual(nwUsers.length);
     });
 });