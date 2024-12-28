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