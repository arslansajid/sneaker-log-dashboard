
import { db } from '../firebase';
import { User } from '../models/user';

export const getUsers = async function () {
    const query = await db.collection('Users').limit(20).get();

    let users = [];

    query.docs.forEach((doc) => {
        const user = User.fromFirestore(doc);
        if (user) {
            users.push(user);
        }
    });
    console.log('Users', users);

    return users;
};

export const addUser = async function (data) {
    await db.collection('Users').add(data);
};

export const deleteUser = async function (id) {
    await db.collection('Users').doc(id).delete();
};

export const updateUser = async function (id, data) {
    await db.collection('Users').doc(id).set(data, { merge: true });
};

export const getUserById = async function (id) {
    const query = await db.collection('Users').doc(id).get();
    return User.fromFirestore(query);
};