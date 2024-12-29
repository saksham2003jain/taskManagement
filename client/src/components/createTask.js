import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        title: "",
        description: "",
        status: "",
        priority: "",
        dueDate: "",
        assignedTo: "",
    });
    const [users, setUsers] = useState([]); // State to store fetched users

    const { title, description, priority, dueDate, assignedTo } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            if (!title || !description || !priority || !dueDate) {
                console.log(priority);
                return alert("All fields are required!");

            }
            const body = { title, description, priority, dueDate, assignedTo };

            const response = await fetch("http://3.108.52.224:5000/task/create", {
                method: "POST",
                headers: { "Content-type": "application/json", token: localStorage.token },
                body: JSON.stringify(body),
            });

            const parseRes = await response.json();
            console.log(parseRes);


            if (response.ok) {
                alert("Task created successfully!");
                navigate("/dashboard");
            } else {
                alert(parseRes.message || "Task creation failed.");
            }
        } catch (error) {
            console.error(error.message);
            alert("An error occurred while creating the task.");
        }
    };

    const getAllUsers = async (e) => {
        try {
            const response = await fetch("http://3.108.52.224:5000/auth/get-all-users", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseRes = await response.json();
            setUsers(parseRes); // Set the users in state

        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        getAllUsers(); // Fetch users when component mounts
    }, []);



    return (
        <div>
            <h1 className="text-center my-5">Create Task</h1>
            <form onSubmit={onSubmitForm}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="form-control my-3"
                    value={title}
                    onChange={onChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    className="form-control my-3"
                    value={description}
                    onChange={onChange}
                />
                {/* <input
                    type="text"
                    name="status"
                    placeholder="Status"
                    className="form-control my-3"
                    value="Pending"
                /> */}
                <select
                    name="priority"
                    className="form-control my-3"
                    value={priority}
                    onChange={e => onChange(e)}
                >
                    <option value="" disabled>
                        Select Priority
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
                    <option value="">Select User</option>
                    {users.map((user) => (
                        <option key={user.user_id} value={user.user_id}>
                            {user.user_name} ({user.user_email})
                        </option>
                    ))}
                </select>
                <button className="btn btn-success btn-block">Submit</button>
            </form>
            {/* <Link to="/login" className="btn btn-link mt-3">Login</Link> */}
        </div>
    );
};

export default CreateTask;