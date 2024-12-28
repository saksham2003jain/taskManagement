const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");


// Register
router.post("/register", validInfo, async (req, res) => {
    try {

        // destructre the req.body (name,email,password,role)

        const { name, email, password, role } = req.body;

        // check if user already exist
        const user = await pool.query("SELECT * FROM users WHERE user_email=$1", [email]);


        if (user.rows.length !== 0) {
            return res.status(401).send("user already exists.");
        }

        // bycrypt the password
        const saltRound = 7;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        //enter the new user inside the db
        const newUser = await pool.query(
            "INSERT INTO users (user_name, user_email, user_password, role_id) VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) RETURNING *",
            [name, email, bcryptPassword, role]
        );

        // generating the jwt token

        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error in Register");

    }
});

//Login//
router.post("/login", validInfo, async (req, res) => {
    try {
        // destructure the req.body in email and password   
        const { email, password } = req.body;

        // check if user exist or not
        const user = await pool.query("SELECT * FROM users WHERE user_email=$1", [email]);

        if (user.rows.length == 0) {
            return res.status(401).json("password or email is incorrect.")
        }
        // check if incomming password is same as db password
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            return res.status(401).send("Password is incorrect.");
        }

        // generate the jwt token
        const token = jwtGenerator(user.rows[0].user_id);

        res.json({ token });


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error in Login");
    }
});

// for any verification
router.get("/is-verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error in is-verify.");
    }
});

// get all users
router.get("/get-all-users", authorization, async (req, res) => {
    try {
        const user = await pool.query("SELECT * FROM users");
        console.log(user.rows);
        res.status(200).json(user.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error in jwtAuth getallusers");
    }
})

module.exports = router;