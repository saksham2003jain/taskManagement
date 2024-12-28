import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const UpdateTask = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get("id");
    console.log(taskId);


    const [inputs, setInputs] = useState({
        title: "",
        description: "",
        status: "",
        priority: "",
        dueDate: "",
        assignedTo: "",
    });
    const [users, setUsers] = useState([]); // State to store fetched users

    const { title, description, status, priority, dueDate, assignedTo } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { title, description, status, priority, dueDate, assignedTo };

            const response = await fetch("http://localhost:5000/task/update", {
                method: "PUT",
                headers: {
                    token: localStorage.token,
                    "Content-Type": "application/json",
                    id: taskId
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const error = await response.json();
                return alert(`Task has not been updated: ${error}`);
            }
            alert("Task Updated Successfully.");
            navigate("/dashboard");
        } catch (error) {
            console.error(error.message);
            alert("An error occurred while updating the task.");
        }
    };

    const getAllUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/auth/get-all-users", {
                method: "GET",
                headers: { token: localStorage.token },
            });
            const parseRes = await response.json();
            setUsers(parseRes); // Set the users in state
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const getTaskDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/task/${taskId}`, {
                method: "GET",
                headers: { token: localStorage.token },
            });
            const task = await response.json();
            setInputs({
                title: task.task_title || "",
                description: task.task_description || "",
                status: task.task_status || "",
                priority: task.task_priority || "",
                dueDate: task.task_due_date || "",
                assignedTo: task.task_assigned_to || "",
            });
        } catch (error) {
            console.error("Error fetching task details:", error);
        }
    };

    useEffect(() => {
        if (taskId) {
            getTaskDetails();
        }
        getAllUsers();
    }, [taskId]);

    return (
        <div>
            <h1 className="text-center my-5">Update Task</h1>
            <form onSubmit={onSubmitForm}>
                <input
                    type="text"
                    name="title"
                    placeholder="Update Title"
                    className="form-control my-3"
                    value={title}
                    onChange={onChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Update Description"
                    className="form-control my-3"
                    value={description}
                    onChange={onChange}
                />
                <select
                    name="status"
                    className="form-control my-3"
                    value={status}
                    onChange={onChange}
                >
                    <option value="" disabled>
                        Update Status
                    </option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>
                <select
                    name="priority"
                    className="form-control my-3"
                    value={priority}
                    onChange={onChange}
                >
                    <option value="" disabled>
                        Update Priority
                    </option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <input
                    type="date"
                    name="dueDate"
                    className="form-control my-3"
                    value={dueDate}
                    onChange={onChange}
                />
                <select
                    name="assignedTo"
                    className="form-control my-3"
                    value={assignedTo}
                    onChange={onChange}
                >
                    <option value="">Update User you want to assign task</option>
                    {users.map((user) => (
                        <option key={user.user_id} value={user.user_id}>
                            {user.user_name} ({user.user_email})
                        </option>
                    ))}
                </select>
                <button className="btn btn-success btn-block">Update Task</button>
            </form>
        </div>
    );
};

export default UpdateTask;
