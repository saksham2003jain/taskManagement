import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Login = ({ setAuth }) => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState(""); // To handle login errors

    const { email, password } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { email, password };
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(body),
            });

            const parseRes = await response.json();

            if (response.ok) {
                localStorage.setItem("token", parseRes.token); // Store the token
                setAuth(true);
            } else {
                setError(parseRes.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error(error.message);
            setError("An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <Fragment>
            {/* Header */}
            <div className="login-header text-center my-4">
                <h1>Login</h1>
            </div>

            {/* Error Message */}
            {error && <div className="alert alert-danger text-center">{error}</div>}

            {/* Login Form */}
            <form className="login-form" onSubmit={onSubmitForm}>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form-control my-3"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="form-control my-3"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success btn-block">
                    Login
                </button>
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

export default Login;
