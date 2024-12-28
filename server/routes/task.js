const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
// const { upload } = require("../middleware/multer");
// const { uploadOnCloudinary } = require("../utils/cloudinary");
// const { params } = require("express-validator");


// to get all task
router.get("/view", authorization, async (req, res) => {
    try {
        const list = await pool.query("SELECT * FROM tasks");
        res.json(list.rows);

    } catch (error) {
        console.error(error.message);
        return res.send(500).json("Server error in dashboard");
    }
});


// create task
router.post("/create", authorization, async (req, res) => {
    try {
        // destructre the body
        const { title, description, status, priority, dueDate, assignedTo } = req.body;

        // fetching the details of user who is making the task
        const user = await pool.query("SELECT * FROM users WHERE user_id=$1", [req.user]);
        // res.json(user.rows[0]);


        const permission = await pool.query("SELECT permission FROM roles WHERE role_id=$1", [user.rows[0].role_id]);
        const permit = permission.rows[0].permission.tasks;
        // res.json(permit);

        if (permit.create) {
            if (![title, description, status, priority, dueDate].every(Boolean)) {
                return res.status(401).json("Missing Details.");
            }
            // when you are user and you don't have power to assign 
            if (!permit.assign && [assignedTo].every(Boolean)) {
                return res.status(500).json("you are not allowed to assign task.")
            }

            // const avatarLocalPath = files?.avatar[0]?.path;

            // if (!avatarLocalPath) {
            //     throw new ApiError(400, "Avatar file is required")
            // }
            // const avatar = await uploadOnCloudinary(avatarLocalPath);
            // if (!avatar) {
            //     throw new ApiError(400, "Avatar file is required")
            // }

            const assignedBy = user.rows[0].user_id;
            const newTask = await pool.query(
                "INSERT INTO tasks (task_title,task_description,task_assigned_to,task_assigned_by,task_status,task_priority,task_due_date) VALUES ($1,$2,(SELECT user_id FROM users WHERE user_name = $3),$4,$5,$6,$7) RETURNING *", [title, description, assignedTo, assignedBy, status, priority, dueDate]
            );

            res.json({ newTask });

        }



    } catch (error) {
        console.error(error.message);
        return res.status(500).json("Server error in create task");
    }
});

// update task
router.put("/update", authorization, async (req, res) => {
    try {
        const { id } = req.query;
        const { title, description, status, priority, dueDate, assignedTo } = req.body;

        if (!id) {
            return res.status(400).json("Task ID is required.");
        }

        // fetching the details of user who is making the task
        const user = await pool.query("SELECT user_id,role_id FROM users WHERE user_id=$1", [req.user]);
        // res.json(user.rows[0].);
        const owner = await pool.query("SELECT task_assigned_by FROM tasks WHERE task_id=$1", [id]);
        // res.json(owner.rows[0].task_assigned_by);

        const permission = await pool.query("SELECT permission FROM roles WHERE role_id=$1", [user.rows[0].role_id]);
        const permit = permission.rows[0].permission.tasks;


        if (user.rows[0].user_id != owner.rows[0].task_assigned_by && !permit.assign) {
            return res.status(501).json("You are not authorized to update this task.");
        }



        const updatedTask = await pool.query(
            `UPDATE tasks
            SET task_title = COALESCE($1, task_title),
                task_description = COALESCE($2, task_description),
                task_status = COALESCE($3, task_status),
                task_priority = COALESCE($4, task_priority),
                task_due_date = COALESCE($5, task_due_date),
                task_assigned_to = COALESCE($6, task_assigned_to)
            WHERE task_id = $7 RETURNING *`,
            [title, description, status, priority, dueDate, assignedTo, id]
        );

        if (updatedTask.rows.length === 0) {
            return res.status(404).json("Task not found.");
        }

        res.json(updatedTask.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server error in updating task.");
    }
});

// delete task
router.delete("/delete", authorization, async (req, res) => {

    try {

        const { id } = req.query;

        // fetching the details of user who is making the task
        const user = await pool.query("SELECT user_id,role_id FROM users WHERE user_id=$1", [req.user]);

        const owner = await pool.query("SELECT task_assigned_by FROM tasks WHERE task_id=$1", [id]);

        const permission = await pool.query("SELECT permission FROM roles WHERE role_id=$1", [user.rows[0].role_id]);
        const permit = permission.rows[0].permission.tasks;

        if (user.rows[0].user_id != owner.rows[0].task_assigned_by && !permit.assign) {
            return res.status(501).json("You are not authorized to delete this task.");
        }

        const task = await pool.query("SELECT * FROM tasks WHERE task_id = $1", [id]);
        if (task.rows.length === 0) {
            return res.status(404).json("Task not found.");
        }

        // Delete the task
        await pool.query("DELETE FROM tasks WHERE task_id = $1", [id]);

        res.json("Task deleted successfully.");

    } catch (error) {
        console.error(error.message);
        return res.status(500).json("Server error in deleting task.")

    }


});


module.exports = router;