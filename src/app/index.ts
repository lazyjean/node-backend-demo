import express, {Application, Router} from "express";
import rest from "../services/user/delivery/rest";
import {logger, expressMiddlewareLogger} from "./logger";

function main() {
    const app: Application = express();
    var router: Router = Router();
    const port = process.env.PORT || 3000;

    // setup middlewares
    app.use(express.urlencoded({extended: false}))
    app.use(express.json())
    app.use(expressMiddlewareLogger())
    app.use(router)

    // setup routes
    router.post("/api/v1/register", rest.register)
    router.post("/api/v1/login", rest.login)

    // app.use(rest.authMiddleware)
    // router.get("/api/v1/profile", rest.profile, rest.authMiddleware)

    app.listen(port, () => {
        logger.info(`Server Running here 👉 http://localhost:${port}`)
    })
}

main()
