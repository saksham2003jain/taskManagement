const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const upload = require("../middleware/multer");
// const { uploadOnCloudinary } = require("../utils/cloudinary");
// const { params } = require("express-validator");
// const path = require("path");
const sendMail = require("../utils/mailer");



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
        const { title, description, priority, dueDate, assignedTo } = req.body;

        // fetching the details of user who is making the task
        const user = await pool.query("SELECT * FROM users WHERE user_id=$1", [req.user]);
        // res.json(user.rows[0]);
        const status = "Pending";

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

            const assignedBy = user.rows[0].user_id;
            const newTask = await pool.query(
                "INSERT INTO tasks (task_title,task_description,task_assigned_to,task_assigned_by,task_status,task_priority,task_due_date) VALUES ($1,$2,(SELECT user_id FROM users WHERE user_name = $3),$4,$5,$6,$7) RETURNING *", [title, description, assignedTo, assignedBy, status, priority, dueDate]
            );

            // Fetch email of the assigned user
            console.log(assignedTo);
            const assignedUser = await pool.query("SELECT user_email FROM users WHERE user_id = $1", [assignedTo]);
            const assignedEmail = assignedUser.rows[0]?.user_email;


            if (!assignedEmail) {
                return res.status(404).json("Assigned user's email not found.");
            }

            // Send email notification
            const subject = `New Task Assigned: ${title}`;
            const text = `You have been assigned a new task: "${title}".\n\nDescription: ${description}\nPriority: ${priority}\nDue Date: ${dueDate}`;
            const html = `
            <h1>New Task Assigned</h1>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Priority:</strong> ${priority}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
            <p>Please log in to your account to view more details.</p>
        `;

            await sendMail(assignedEmail, subject, text, html);

            res.json({ newTask });

        }



    } catch (error) {
        console.error(error.message);
        return res.status(500).json("Server error in create task");
    }
});


// update task
// router.put("/update", authorization, async (req, res) => {
//     try {
//         const id = req.headers.id;
//         let { title, description, status, priority, dueDate, assignedTo } = req.body;

//         if (!id) {
//             return res.status(400).json("Task ID is required.");
//         }

//         // fetching the details of user who is making the task
//         const user = await pool.query("SELECT user_id,role_id FROM users WHERE user_id=$1", [req.user]);
//         // res.json(user.rows[0].);
//         const owner = await pool.query("SELECT task_assigned_by,task_due_date FROM tasks WHERE task_id=$1", [id]);
//         // res.json(owner.rows[0].task_assigned_by);

//         if (!dueDate) {
//             dueDate = owner.rows[0].task_due_date;
//         }

//         const assignUser = await pool.query("SELECT user_name FROM users WHERE user_name=$1", [assignedTo]);

//         assignedTo = assignUser;


//         const permission = await pool.query("SELECT permission FROM roles WHERE role_id=$1", [user.rows[0].role_id]);
//         const permit = permission.rows[0].permission.tasks;


//         if ((user.rows[0].user_id != owner.rows[0].task_assigned_by || user.rows[0].user_id != owner.rows[0].task_assigned_to) && !permit.assign) {
//             return res.status(501).json("You are not authorized to update this task.");
//         }



//         const updatedTask = await pool.query(
//             `UPDATE tasks
//             SET task_title = COALESCE($1, task_title),
//                 task_description = COALESCE($2, task_description),
//                 task_status = COALESCE($3, task_status),
//                 task_priority = COALESCE($4, task_priority),
//                 task_due_date = COALESCE($5, task_due_date),
//                 task_assigned_to = COALESCE($6, task_assigned_to)
//             WHERE task_id = $7 RETURNING *`,
//             [title, description, status, priority, dueDate, assignedTo, id]
//         );

//         if (updatedTask.rows.length === 0) {
//             return res.status(404).json("Task not found.");
//         }

//         res.json(updatedTask.rows[0]);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json("Server error in updating task.");
//     }
// });


router.put("/update", authorization, async (req, res) => {
    try {
        const id = req.headers.id; // Task ID from headers
        let { title, description, status, priority, dueDate, assignedTo } = req.body;

        // Validate that the task ID is provided
        if (!id) {
            return res.status(400).json("Task ID is required.");
        }

        // Fetching the details of the user making the request
        const user = await pool.query("SELECT user_id, role_id FROM users WHERE user_id = $1", [req.user]);

        // Fetching the task's current details
        const owner = await pool.query(
            "SELECT task_assigned_by, task_assigned_to, task_due_date, task_title, task_description, task_status, task_priority FROM tasks WHERE task_id = $1",
            [id]
        );

        if (owner.rows.length === 0) {
            return res.status(404).json("Task not found.");
        }

        // Default values for fields that are not provided in the request body
        if (!title) {
            title = owner.rows[0].task_title;
        }

        if (!description) {
            description = owner.rows[0].task_description;
        }

        if (!status) {
            status = owner.rows[0].task_status;
        }

        if (!priority) {
            priority = owner.rows[0].task_priority;
        }

        if (!dueDate) {
            dueDate = owner.rows[0].task_due_date;
        }



        // Validate assigned user
        if (assignedTo) {
            const assignUser = await pool.query(
                "SELECT user_id FROM users WHERE user_name = $1",
                [assignedTo]
            );

            if (assignUser.rows.length === 0) {
                return res.status(400).json("Assigned user does not exist.");
            }

            // Assign user_id instead of user_name to `assignedTo`
            assignedTo = assignUser.rows[0].user_id;
        } else {
            assignedTo = null;  // If no user is assigned, set to null
        }

        // Fetch user permissions
        const permission = await pool.query(
            "SELECT permission FROM roles WHERE role_id = $1",
            [user.rows[0].role_id]
        );
        const taskPermissions = permission.rows[0].permission.tasks;

        // Authorization check: Ensure user has the right to update
        const isOwner = user.rows[0].user_id === owner.rows[0].task_assigned_by;
        const isAssignedTo = user.rows[0].user_id === owner.rows[0].task_assigned_to;

        if (!isOwner && !isAssignedTo && !taskPermissions.assign) {
            return res.status(403).json("You are not authorized to update this task.");
        }

        // Update the task
        const updatedTask = await pool.query(
            `UPDATE tasks
            SET task_title = COALESCE($1, task_title),
                task_description = COALESCE($2, task_description),
                task_status = COALESCE($3, task_status),
                task_priority = COALESCE($4, task_priority),
                task_due_date = COALESCE($5, task_due_date),
                task_assigned_to = COALESCE($6, task_assigned_to)
            WHERE task_id = $7
            RETURNING *`,
            [title, description, status, priority, dueDate, assignedTo, id]
        );

        if (updatedTask.rows.length === 0) {
            return res.status(404).json("Task not found.");
        }

        res.json(updatedTask.rows[0]); // Return updated task
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server error in updating task.");
    }
});



// delete task
router.delete("/delete", authorization, async (req, res) => {

    try {

        const id = req.headers.query;


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