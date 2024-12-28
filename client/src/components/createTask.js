import React, { useState } from "react";
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
    const { title, description, status, priority, dueDate, assignedTo } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            if (!title || !description || !status || !priority || !dueDate) {
                return alert("All fields are required!");
            }

            const body = { title, description, status, priority, dueDate, assignedTo };
            const response = await fetch("http://localhost:5000/task/create", {
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
                <input
                    type="text"
                    name="status"
                    placeholder="Status"
                    className="form-control my-3"
                    value={status}
                    onChange={onChange}
                />
                <input
                    type="text"
                    name="priority"
                    placeholder="Priority"
                    className="form-control my-3"
                    value={priority}
                    onChange={onChange}
                />
                <input
                    type="date"
                    name="dueDate"
                    className="form-control my-3"
                    value={dueDate}
                    onChange={onChange}
                />
                <input
                    type="text"
                    name="assignedTo"
                    placeholder="Name of user to assign"
                    className="form-control my-3"
                    value={assignedTo}
                    onChange={onChange}
                />
                <button className="btn btn-success btn-block">Submit</button>
            </form>
            {/* <Link to="/login" className="btn btn-link mt-3">Login</Link> */}
        </div>
    );
};

export default CreateTask;
