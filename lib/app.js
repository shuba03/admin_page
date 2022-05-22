"use strict";

const express = require("express");
const routes = require("./routes");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

routes.register(app);

async function startServer() {
    try {
        console.log("Starting server....");
        app.listen(8080);
        console.log("Sever is up and running...");
    } catch (err) {
        console.error("Failed to start application!", err);
        process.exit(1);
    }
}

startServer();
