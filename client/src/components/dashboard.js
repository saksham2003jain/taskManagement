import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ setAuth }) => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [tasksAssignedByMe, setTasksAssignedByMe] = useState([]);
    const [tasksAssignedToMe, setTasksAssignedToMe] = useState([]);

    const createTask = () => {
        navigate("/createTask");
    };

    const getName = async () => {
        try {
            const response = await fetch("http://localhost:5000/dashboard/", {
                method: "GET",
                headers: { token: localStorage.token },
            });
            const parseRes = await response.json();
            setName(parseRes.user_name);
            setEmail(parseRes.user_email);
            setRole(parseRes.role_name === "admin" ? "Admin" : "User");
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchTasks = async () => {
        try {
            const assignedByMeResponse = await fetch(
                "http://localhost:5000/dashboard/assigned_by_me",
                { method: "GET", headers: { token: localStorage.token } }
            );
            const assignedToMeResponse = await fetch(
                "http://localhost:5000/dashboard/assigned_to_me",
                { method: "GET", headers: { token: localStorage.token } }
            );
            setTasksAssignedByMe(await assignedByMeResponse.json());
            setTasksAssignedToMe(await assignedToMeResponse.json());
        } catch (error) {
            console.error(error.message);
        }
    };

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
    };

    useEffect(() => {
        getName();
        fetchTasks();
    }, []);

    return (
        <Fragment>
            {/* Header */}
            <div className="dashboard-header">
                <div className="user-info">
                    <h1 className="dashboard-title">Welcome, {name} <span>({role} Control)</span></h1>
                    <span className="dashboard-email">{email}</span>
                </div>
                <button className="btn logout-button" onClick={logout}>
                    Logout
                </button>
            </div>

            {/* Action bar */}
            <div className="actionbar">
                <button
                    className="btn actionbar-item"
                    onClick={createTask}
                >
                    + Create New Task
                </button>
            </div>

            {/* Tasks Assigned By Me */}
            <section className="tasks-section">
                <div className="tasks-header">
                    <h2>Tasks Assigned By Me</h2>
                    <button
                        className="btn view-all"
                        onClick={() =>
                            navigate("/tasks", { state: { tasks: tasksAssignedByMe } })
                        }
                    >
                        View All
                    </button>
                </div>
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Task Name</th>
                            <th>Due Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasksAssignedByMe.slice(0, 5).map((task, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{task.task_title}</td>
                                <td>{new Date(task.task_due_date).toLocaleDateString()}</td>
                                <td>{task.task_status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Tasks Assigned To Me */}
            <section className="tasks-section">
                <div className="tasks-header">
                    <h2>Tasks Assigned To Me</h2>
                    <button
                        className="btn view-all"
                        onClick={() =>
                            navigate("/tasks", { state: { tasks: tasksAssignedToMe } })
                        }
                    >
                        View All
                    </button>
                </div>
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Task Name</th>
                            <th>Due Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasksAssignedToMe.slice(0, 5).map((task, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{task.task_title}</td>
                                <td>{new Date(task.task_due_date).toLocaleDateString()}</td>
                                <td>{task.task_status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </Fragment>
    );
};

export default Dashboard;
