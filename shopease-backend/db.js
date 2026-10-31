const fs = require("node:fs");
const path = require("node:path");
const process = require("node:process");

const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envPath)) {
    process.loadEnvFile(envPath);
}

const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: process.env.DB_SSL_CA
    }
});

db.connect((err) => {
    if (err) {
        console.error("Connection error:", err.message);
        return;
    }

    console.log("MySQL Connected");
});

module.exports = db;