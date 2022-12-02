/**
 * @jest-environment node
 */
import {createUser, deleteUser} from "../services/users-service";
import {createTuit, deleteTuit, findTuitByUser, findTuitById} from "../services/tuits-service";
import {findAllTuitsLikedByUser, userTogglesTuitLikes} from "../services/likes-service";

describe('user gets all tuits liked by them', () => {

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

        // all tuits are liked first user
        const firstUserId = nwUsers[0]._id;
        for (const tuit of nwTuits) {
            await userTogglesTuitLikes(firstUserId, tuit._id);
        }
    });

    afterAll(async () => {
        // remove all data created
        const firstUserId = nwUsers[0]._id;
        for (const tuit of nwTuits) {
            await userTogglesTuitLikes(firstUserId, tuit._id);
        }
        await Promise.all(nwUsers.map(async (user) => {
            const tuits = await findTuitByUser(user._id);
            for (const tuit of tuits) {
                await deleteTuit(tuit._id);
            }
            await deleteUser(user._id);
        }))
    })

    test('can retrieve my likes', async () => {
        const firstUserId = nwUsers[0]._id;

        // retreive all tuits liked by user
        const allLikedTuitsByUser = await findAllTuitsLikedByUser(firstUserId);

        // check if count of tuits liked is same
        expect(allLikedTuitsByUser.length).toEqual(nwTuits.length);

        // compare individual tuits data
        allLikedTuitsByUser.forEach(likedTuit => {
            const newTuit = nwTuits.find(newTuit => newTuit._id === likedTuit._id);
            expect(likedTuit.tuit).toEqual(newTuit.tuit);
            expect(likedTuit.postedOn).toEqual(newTuit.postedOn);
            expect(likedTuit.postedBy).toEqual(newTuit.postedBy);
        });
    });
});