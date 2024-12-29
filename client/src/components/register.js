import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";


const Register = ({ setAuth }) => {

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: "",
        role: "",
    });
    const { email, password, name, role } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    // making POST request to the backend server
    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { email, password, name, role };
            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();// In this we have token
            localStorage.setItem("token", parseRes.token);// store the token in local storage
            setAuth(true);
            console.log(parseRes);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Fragment>
            <h1 className="text-center my-5" >Register</h1>
            <form onSubmit={onSubmitForm}>
                <input
                    type="email"
                    name="email"
                    placeholder="email"
                    className="form-control my-3"
                    value={email}
                    onChange={e => onChange(e)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password" className="form-control my-3"
                    value={password}
                    onChange={e => onChange(e)}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="name"
                    className="form-control my-3"
                    value={name}
                    onChange={e => onChange(e)}
                />
                <select
                    name="role"
                    className="form-control my-3"
                    value={role}
                    onChange={e => onChange(e)}
                >
                    <option value="" disabled>
                        Select Role
                    </option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <button className="btn btn-success btn-block" >Submit</button>
            </form>
            {/* Registration Link */}
            <div className="text-center mt-3">
                <p>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </Fragment>
    );
};

export default Register;