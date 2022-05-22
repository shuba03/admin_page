"use strict";
const express = require("express");
const path = require("path");
const multer = require('multer');
const upload = multer();
// const session = require('express-session');
// const MySQLStore = require('express-mysql-session')(session);

const { MySQLConnectionParams } = require("./constant");

const ProductHandler = require("./handlers/product-handler");
// const sessionStore = new MySQLStore(MySQLConnectionParams);

const startTime = Date.now();

function register(router) {

    // router.use(session({
    //     secret: 'session_encryption_key',
    //     name: 'app_session_id',
    //     resave: false,
    //     saveUninitialized: true,
    //     cookie: { path: '/', httpOnly: true, secure: false, maxAge: 2 * 60 * 60 * 1000 }
    // }));

    router.use('/static', express.static('dist'))

    router.get("/ping", (req, res) => {
        res.json({
            status: "running",
            upTime: (Date.now() - startTime)
        });
    });

    router.get('/', (req, res) => {
        res.redirect('/queen-mobiles-admin');
    })

    router.get(['/queen-mobiles-admin', '/queen-mobiles-admin/*'], (req, res) => {
        res.sendFile(path.join(__dirname, "../dist/queen-mobiles-admin.html"));
    });

    router.post("/api/add-product", upload.single("image"), ProductHandler.addProduct);
}

module.exports = {
    register
}