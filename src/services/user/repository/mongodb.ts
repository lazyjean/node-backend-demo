import {MongoClient} from "mongodb";
import {User} from "../../domain/user";
import errors from "../../domain/errors";
import {logger} from "../../../app/logger";

const uri: string = process.env.MONGODB_URI || "mongodb://root:example@localhost:27017/";
const dbName = process.env.MONGO_DB_NAME || "node-backend-demo"

logger.info("init mongodb client with uri: " + uri)
const client = new MongoClient(uri);

const userCollection = async () => {
    const db = client.db(dbName)
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
        logger.error(e)
        throw errors.UserAlreadyExists
    }
}

export const deleteUser = async (username: string) => {
    try {
        await (await userCollection()).updateOne({$set: {deletedAt: new Date()}}, {username: username})
    } catch (e) {
        logger.error(e)
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
        logger.error(e)
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

