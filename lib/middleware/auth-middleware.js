"use strict"

const SESSION_ID_KEY = "app_session_id";


function auth(req, res, next) {
    const cookies = req.cookies;

    console.log("inside auth:", cookies);

    next();
}

function session(req, res, next) {
    const cookies = req.cookies;

    if (!cookies[SESSION_ID_KEY]) {
        res.he
    }

    console.log(cookies);

    next();
}


module.exports = { auth, session }