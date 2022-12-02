/**
 * @jest-environment node
 */
import {createUser, deleteUser} from "../services/users-service";
import {createTuit, deleteTuit, findTuitByUser, findTuitById} from "../services/tuits-service";
import {findAllTuitsDislikedByUser, userTogglesTuitDislikes} from "../services/dislikes-service";

describe('user gets all tuits disliked by them', () => {

    // sample users
    const usernames = [
        "karan", "suresh", "mahes"
    ];

    let nwUsers = [];
    let nwTuits = [];

    beforeAll(async () => {
        // insert several known users
        nwUsers = await Promise.all(
            usernames.map(async (username) => {
                return await createUser({
                    username,
                    password: `${username}123`,
                    email: `${username}@hogwarts.com`
                })
            })
        )

        // create tuits for data
        nwTuits = await Promise.all(nwUsers.map(async (user) =>
            await createTuit(user._id, {
                tuit: `testing tuit made by ${user.username}`
            })
        ));

        // all tuits are disliked first user
        const firstUserId = nwUsers[0]._id;
        for (const tuit of nwTuits) {
            await userTogglesTuitDislikes(firstUserId, tuit._id);
        }
    });

    afterAll(async () => {
        // remove all data created
        const firstUserId = nwUsers[0]._id;
        for (const tuit of nwTuits) {
            await userTogglesTuitDislikes(firstUserId, tuit._id);
        }
        await Promise.all(nwUsers.map(async (user) => {
            const tuits = await findTuitByUser(user._id);
            for (const tuit of tuits) {
                await deleteTuit(tuit._id);
            }
            await deleteUser(user._id);
        }))
    })

    test('can retrieve my dislikes', async () => {
        const firstUserId = nwUsers[0]._id;

        // retreive all tuits disliked by user
        const allDislikedTuitsByUser = await findAllTuitsDislikedByUser(firstUserId);

        // check if count of tuits disliked is same
        expect(allDislikedTuitsByUser.length).toEqual(nwTuits.length);

        // compare individual tuits data
        allDislikedTuitsByUser.forEach(dislikedTuit => {
            const newTuit = nwTuits.find(newTuit => newTuit._id === dislikedTuit._id);
            expect(dislikedTuit.tuit).toEqual(newTuit.tuit);
            expect(dislikedTuit.postedOn).toEqual(newTuit.postedOn);
            expect(dislikedTuit.postedBy).toEqual(newTuit.postedBy);
        });
    });
});