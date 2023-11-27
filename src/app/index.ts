import express, {Application, Router} from "express";
import rest from "../services/user/delivery/rest";
import {logger, expressMiddlewareLogger} from "./logger";
import {initApp} from "./app";

function main() {
    // we can use DI pattern here if we want to inject some dependencies
    const app = initApp();

    // start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        logger.info(`Server Running here 👉 http://localhost:${port}`)
    })
}

main()
