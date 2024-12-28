import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const TasksPage = () => {
    const location = useLocation();
    const { tasks } = location.state || { tasks: [] }; // Default to an empty array

    // State to store names
    const [assignedNames, setAssignedNames] = useState({});

    // Function to fetch name by ID
    async function getName(id) {
        try {
            if (!id) {
                return "None";
            }
            const response = await fetch("http://localhost:5000/dashboard/get_by_id", {
                method: "GET",
                headers: { userId: id, token: localStorage.token },
            });

            const parseRes = await response.json();

            if (!response.ok) {
                console.error(parseRes);
                return "Unknown"; // Fallback for errors
            }

            return parseRes.user_name; // Return the user_name
        } catch (error) {
            console.error(error.message);
            return "Unknown"; // Fallback for network errors
        }
    }


    // Fetch names for all tasks
    useEffect(() => {
        const fetchNames = async () => {
            const names = {};
            for (const task of tasks) {
                const name = await getName(task.task_assigned_to);
                names[task.task_assigned_to] = name;
            }
            setAssignedNames(names);
        };

        fetchNames();
    }, [tasks]);

    return (
        <div className="container">
            <h1 className="my-3">Tasks Assigned By Me</h1>
            <div className="row">
                {tasks.map((task, index) => (
                    <div key={index} className="col-md-4 my-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{task.task_title}</h5>
                                <p className="card-text">Description: {task.task_description}</p>
                                <p className="text-muted">
                                    Due Date: {new Date(task.task_due_date).toLocaleDateString()}
                                </p>
                                <p className="card-text">Priority: {task.task_priority}</p>
                                <p className="card-text">Status: {task.task_status}</p>
                                <p className="card-text">
                                    Assigned To: {assignedNames[task.task_assigned_to] || "None"}
                                </p>
                            </div>
                            <button className="btn btn-primary btn-block">Update</button>
                            <br />
                            <button className="btn btn-primary btn-block">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TasksPage;
