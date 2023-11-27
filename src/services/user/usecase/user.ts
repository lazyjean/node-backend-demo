import {createUser, findUserByUsername} from "../repository/mongodb";
import bcrypt from "bcrypt";
import errors from "../../domain/errors";
import {getLoginFailedCount, increaseLoginFailedCount, resetLoginFailedCount} from "../repository/redis";
import {User} from "../../domain/user";
import token from "./token";


export interface LoginRsp {
    loginUser: User,
    token: string
}

const login = async (username: string, password: string): Promise<LoginRsp>=> {
    // check login failed count
    const failedCount = await getLoginFailedCount(username)
    if (failedCount >= 3) {
        throw errors.AccountIsLocked
    }
    const user = await findUserByUsername(username)

    // compare password
    if (!bcrypt.compareSync(password, user.password!)) {
        await increaseLoginFailedCount(username)
        const remaining = 3 - failedCount - 1
        let msg = "you only left " + remaining + " attempts to login";
        if (remaining == 0) {
            msg = "Your account has been locked in 5 minutes"
        }
        throw errors.InvalidPassword(msg)
    }

    // generate jwt token, and then return
    await resetLoginFailedCount(username)

    return {
        loginUser: {
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar
        },
        token: token.generate(username, "24h")
    }
}

const register = async (username: string, password: string) => {
    if (password.length < 8) {
        throw errors.PasswordTooShort
    }
    const hashedPassword = bcrypt.hashSync(password, 10)
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

const verifyToken = (val: string) => {
    return token.verify(val)
}

export default {
    login,
    register,
    findUser,
    verifyToken
}
