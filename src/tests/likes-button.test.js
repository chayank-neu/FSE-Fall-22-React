/**
 * @jest-environment node
 */

import {createUser, deleteUser} from "../services/users-service";
import {createTuit, deleteTuit, findTuitByUser, findTuitById} from "../services/tuits-service";
import {findAllTuitsLikedByUser, userTogglesTuitLikes} from "../services/likes-service";

describe('updating tuits stats by like button', () => {

    // sample users
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
            await userTogglesTuitLikes(user._id, nwTuit._id);
        }
        await Promise.all(nwUsers.map(async (user) => {
            const tuits = await findTuitByUser(user._id);
            for (const tuit of tuits) {
                await deleteTuit(tuit._id);
            }
            await deleteUser(user._id);
        }))
    })

    test('updating tuits stats by like button', async () => {
        // creating a tuit form first user
        const firstUser = nwUsers[0];
        nwTuit = await createTuit(firstUser._id, {
            tuit: `testing tuit by ${firstUser.username}`
        });
        
        // all users have interacted with tuit by likeing it
        for (const nwUser of nwUsers) {
            await userTogglesTuitLikes(nwUser._id, nwTuit._id);
        }

        // retreive all tuits liked by user
        const allLikedTuitsByUser = await findAllTuitsLikedByUser(firstUser._id);
        const filteredTuits = allLikedTuitsByUser.filter(tuit => tuit.tuit === nwTuit._id);

        // check if filtered tuits is same as tutis created by user
        expect(filteredTuits.length).toEqual(1);

        const tuitStats = await findTuitById(nwTuit._id)

        // compare the no of likes for tuit
        expect(tuitStats.stats.likes).toEqual(nwUsers.length);
    });
});