import {createUser, findUserByUsername} from "../repository/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import errors from "../../domain/errors";
import {getLoginFailedCount, increaseLoginFailedCount} from "../repository/redis";
import {createInflate} from "zlib";

const sk = "fb0f6084ce77489fe3e5f8eff956d768019691f5551d7b2437ae3679ade1d4e3a55c29deb053e84325f5fee9587a108299051638d0a8c03946d0fa055f0f7cb5"

const login = async (username: string, password: string)=> {
    const failedCount = await getLoginFailedCount(username)
    if (failedCount >= 3) {
        throw errors.AccountIsLocked
    }
    const user = await findUserByUsername(username)
    if (!bcrypt.compareSync(password, user.password)) {
        await increaseLoginFailedCount(username)
        const remaining = 3 - failedCount - 1
        let msg = "you only left " + remaining + " attempts to login";
        if (remaining == 0) {
            msg = "Your account has been locked in 5 minutes"
        }
        throw errors.InvalidPassword(msg)
    }
    return jwt.sign({
        username: user.username
    }, sk, {expiresIn: "24h"})
}

const register = async (username: string, password: string) => {
    if (password.length < 8) {
        throw errors.PasswordTooShort
    }
    const hashedPassword = bcrypt.hashSync(password, 10)
    console.log(bcrypt.compareSync(password, hashedPassword))
    await createUser({
        password: hashedPassword,
        username: username
    })
}

const findUser = async (username: string) => {
    const user = await findUserByUsername(username)
    if (!user) {
        throw errors.UserNotExists
    }
    return user
}

const verifyToken = (token: string) => {
    return jwt.verify(token, sk)
}

export default {
    login,
    register,
    findUser,
    verifyToken
}
