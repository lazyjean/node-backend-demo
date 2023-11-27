import { Request, Response, NextFunction} from "express";
import user from "../usecase/user";
import {User} from "../../domain/user";
import {logger} from "../../../app/logger";
import errors from "../../domain/errors";

const login = (req: Request, res: Response) => {
    user.login(req.body.username, req.body.password).then(result => {
        res.json({
            message: "succeed",
            data: result
        })
    }).catch(err => {
        if (err.message == errors.AccountIsLocked.message) {
            res.status(403)
        } else if (err.message.startsWith(errors.InvalidPassword('').message)) {
            res.status(401)
        } else {
            logger.error(err);
            res.status(500)
        }
        res.json({
            message: "failed, err is " + err,
            data: null
        })
    })
}

const register = (req: Request, res: Response, next: NextFunction) => {
    user.register(req.body.username, req.body.password).then(() => {
        res.json({
            message: "succeed",
            data: null,
        })
    }).catch(err => {
        logger.error(err);
        res.json({
            message: "failed, err is " + err,
            data: null
        })
    })
}

const profile = (req: Request, res: Response) => {
    user.findUser(req.body.username).then((user: User) => {
        res.json({
            message: "succeed",
            data: user
        })
    }).catch(err => {
        logger.error(err);
        res.json({
            message: "failed, err is " + err,
            data: null
        })
    })
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const cookie = req.headers.cookie
    const token = cookie? cookie.split("=")[1] : null
    if (token == null) {
        return res.sendStatus(401)
    }
    if (user.verifyToken(token)) {
        next()
    } else {
        res.json({
            message: "Invalid token",
            data: null
        })
        return res.sendStatus(401)
    }
}

export default {
    login,
    register,
    profile,
    authMiddleware
}
