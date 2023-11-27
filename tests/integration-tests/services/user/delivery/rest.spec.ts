import express from "express";
import {initApp} from "../../../../../src/app/app";
import request  from "supertest";

describe("User REST API", () => {
    jest.setTimeout(10000)
    let app: express.Application;
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    beforeAll( async () => {
        app = initApp();
    });

    it("should return 401 for failed login with wrong password", async () => {
        await request(app)
            .post("/api/v1/login")
            .send({
                username: "root",
                password: "wrong"
            }).expect(401)
    });

    it("should return 200 for successes login", async () => {
        await request(app)
           .post("/api/v1/login")
           .send({
                username: "root",
                password: "password"
            }).expect(200)
    });

    it("should return 403 for failed login that attempts three times or more", async () => {
        for (let i = 0; i < 3; i++) {
            await request(app)
                .post("/api/v1/login")
                .send({
                    username: "root",
                    password: "wrong"
                }).expect(401)
        }

        await request(app)
            .post("/api/v1/login")
            .send({
                username: "root",
                password: "wrong"
            }).expect(403)
    });

    // ACCOUNT_LOCK_DURATION set to 5 seconds when run tests.
    it("should return 200 for successes login after 5 seconds (need wait for 5 min when running in production mode)", async () => {
        await delay(5000)
        await request(app)
            .post("/api/v1/login")
            .send({
                username: "root",
                password: "password"
            }).expect(200)
    });
})
