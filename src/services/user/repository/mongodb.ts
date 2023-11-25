import {MongoClient} from "mongodb";
import {User} from "../../domain/user";
import errors from "../../domain/errors";

console.log("init mongodb client")
const uri = "mongodb://root:example@localhost:27017/";
const client = new MongoClient(uri);

const userCollection = async () => {
    const db = client.db("small-demo")
    const collection = db.collection<User>("users")
    await collection.createIndex({username: 1, email: 1}, {unique: true})
    return collection
}

export async function createUser(user: User) {
    try {
        await (await userCollection()).insertOne({
            ...user,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    } catch (e) {
        console.error(e)
        throw errors.UserAlreadyExists
    }
}

export const deleteUser = async (username: string) => {
    try {
        await (await userCollection()).updateOne({$set: {deletedAt: new Date()}}, {username: username})
    } catch (e) {
        console.error(e)
        throw errors.UserNotExists
    }

}

export async function updateUser(user: User) {
    try {
        await (await userCollection()).updateOne({$set: {
                ...user,
                updatedAt: new Date(),
            }}, {username: user.username})
    } catch (e) {
        console.error(e)
        throw errors.UserNotExists
    }
}

export const findUserByUsername = async (username: string) => {
    const user = await (await userCollection()).findOne<User>({username: username, deletedAt: {$exists: false}})
    if (user == null) {
        throw errors.UserNotExists
    }
    return user
}

export const findByEmail = async (email: string) => {
    const user = await (await userCollection()).findOne({email: email, deletedAt: {$exists: false}})
    if (user == null) {
        throw errors.UserNotExists
    }
    return user
}

