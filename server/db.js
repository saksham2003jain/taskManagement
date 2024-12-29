const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "DoodledooSJ123",
    host: "database-1.cnjl6jnnj86z.ap-south-1.rds.amazonaws.com",
    port: 5432,
    database: "taskmanagement",
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;
