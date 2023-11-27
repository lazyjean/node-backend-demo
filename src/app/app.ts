import express, {Application, Router} from "express";
import {expressMiddlewareLogger} from "./logger";
import rest from "../services/user/delivery/rest";

export const initApp = (): Application => {
    const app: Application = express();
    const router: Router = Router();

    // setup middlewares
    app.use(express.urlencoded({extended: false}))
    app.use(express.json())
    app.use(expressMiddlewareLogger())
    app.use(router)

    // setup routes
    router.post("/api/v1/register", rest.register)
    router.post("/api/v1/login", rest.login)

    return app;
}
