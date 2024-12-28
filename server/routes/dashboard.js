const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// to get user
router.get("/", authorization, async (req, res) => {
    try {
        // res.json(req.user);
        const user = await pool.query("SELECT user_name FROM users WHERE user_id=$1", [req.user]);
        res.json(user.rows[0]);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json("Server Error in dashboard.")

    }
});

// to get user by id
router.get("/get_by_id", authorization, async (req, res) => {
    try {
        // Access userId from request headers
        const userId = req.headers.userid;

        if (!userId) {
            return res.status(400).json("User ID is required.");
        }


        // Query the database for the user_name
        const result = await pool.query(
            "SELECT * FROM users WHERE user_id = $1",
            [userId]
        );
        const isAdmin = await pool.query(
            "SELECT role_name FROM roles WHERE role_id=$1", [req.user]
        );

        if (result.rows.length === 0) {
            return res.status(404).json("User not found.");
        }

        // Send only the user_name
        res.json({ user_name: result.rows[0].user_name });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json("Server Error in dashboard.");
    }
});


// to get all the task assigned to user

router.get("/assigned_to_me", authorization, async (req, res) => {
    try {

        const list = await pool.query("SELECT * FROM tasks WHERE task_assigned_to=$1", [req.user]);
        res.json(list.rows);

    } catch (error) {
        console.error(error.message);
        return res.status(500).json("Server error in dashboard.")
    }
});


// task assigned by user

router.get("/assigned_by_me", authorization, async (req, res) => {
    try {
        const list = await pool.query("SELECT * FROM tasks WHERE task_assigned_by=$1", [req.user]);
        res.json(list.rows);

    } catch (error) {
        console.error(error.message);
        return res.send(500).json("Server error in dashboard");
    }
});

module.exports = router;