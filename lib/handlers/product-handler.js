"use strict";

const MySQLProxy = require("../proxy/mysql-proxy");

async function addProduct(req, res) {
    const bodyData = req.body;
    const imageFile = req.file;
    console.log(imageFile);
    bodyData["image"] = imageFile.buffer;
    bodyData["mimetype"] = imageFile.mimetype;

    try {
        await MySQLProxy.saveProduct(bodyData);
        res.status(200).json({});
    } catch (err) {
        console.error(err);
        res.status(500).json({
            data: err.message
        })
    }
}


module.exports = {
    addProduct
}