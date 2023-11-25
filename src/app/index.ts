import express, {Application, Router, Request, Response} from "express";
import {MongoClient} from "mongodb";
import bodyParser from "body-parser";
import rest from "../services/user/delivery/rest";

function main() {
    const app: Application = express();
    var router: Router = Router();
    const port: number = 3000;

    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
    app.use(router)

    router.post("/api/v1/register", rest.register)
    router.post("/api/v1/login", rest.login)

    // app.use(rest.authMiddleware)
    // router.get("/api/v1/profile", rest.profile, rest.authMiddleware)

    app.listen(port, () => {
        console.log(`Server Running here 👉 http://localhost:${port}`)
    })
}

main()
