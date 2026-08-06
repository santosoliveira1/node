const mysql = require ("mysql2");

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "voucherDev@2024",
    database: "luci" //
})