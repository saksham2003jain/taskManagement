const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "lmno123",
    host: "localhost",
    port: 5432,
    database: "taskmanagement"
});

module.exports = pool;
