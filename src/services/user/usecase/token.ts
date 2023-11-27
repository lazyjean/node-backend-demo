import jwt from "jsonwebtoken";

const sk = "fb0f6084ce77489fe3e5f8eff956d768019691f5551d7b2437ae3679ade1d4e3a55c29deb053e84325f5fee9587a108299051638d0a8c03946d0fa055f0f7cb5"

const verify = (token: string) => {
    return jwt.verify(token, sk)
}

const generate = (username: string, expireIn: string):string => {
    return jwt.sign({
        username,
    }, sk, {expiresIn: expireIn})
}

export default {
    verify,
    generate
}
