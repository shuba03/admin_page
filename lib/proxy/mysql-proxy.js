"use strict";
const uuid = require("uuid");
const Errr = require("errr");
const mysql = require("mysql2/promise");

const MySQLProps = {
    host: "localhost",
    user: "root",
    password: "admin",
    port: 3306
}

let mysqlConnectionPool = null;

class MySQLProxy {
    static getConnectionPool() {
        if (!mysqlConnectionPool) {
            mysqlConnectionPool = mysql.createPool(MySQLProps);
        }
        return mysqlConnectionPool;
    }


    static async saveProduct(data) {
        const { title, brand, color, price, countInStock, description, image, mimetype } = data;

        try {
            const insertQuery =
                "INSERT INTO queen_mobiles.`products` " +
                "(id, name, brand, color, price, count_in_stock, description, image, mime) " +
                "VALUES (?,?,?,?,?,?,?,?,?)";

            const id = uuid.v4();
            await MySQLProxy.getConnectionPool().query(insertQuery, [
                id,
                title,
                brand,
                color,
                price,
                countInStock,
                description,
                image,
                mimetype
            ]);
        } catch (err) {
            Errr.newError("Failed to add product").appendTo(err).throw();
        }
    }
}

module.exports = MySQLProxy