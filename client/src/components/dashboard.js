import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ setAuth }) => {


    const navigate = useNavigate();

    const [name, setName] = useState("");



    async function getName() {
        try {

            const response = await fetch("http://localhost:5000/dashboard/", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();
            setName(parseRes.user_name);
            // console.log(parseRes);



        } catch (error) {
            console.error(error.message);
        }
    }

    async function taskAssignedByMe() {
        try {
            const response = await fetch("http://localhost:5000/dashboard/assigned_by_me", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseRes = await response.json();
            navigate("/tasks", { state: { tasks: parseRes } });
            // console.log(parseRes);

        } catch (error) {
            console.error(error.message);
        }
    }

    async function taskAssignedToMe() {
        try {
            const response = await fetch("http://localhost:5000/dashboard/assigned_to_me", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseRes = await response.json();
            navigate("/tasks", { state: { tasks: parseRes } });
            // console.log(parseRes);

        } catch (error) {
            console.error(error.message);
        }
    }

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
    }

    useEffect(() => { getName() }, []);


    return (
        <Fragment>
            <h1>Dashboard {name} </h1>

            <button className="btn btn-primary btn-block my-3" onClick={e => taskAssignedByMe(e)} >Tasks Assigned By {name}</button>
            <br />
            <button className="btn btn-primary btn-block my-3" onClick={e => taskAssignedToMe(e)} >Tasks Assigned To {name}</button>
            <br />
            <button className="btn btn-primary btn-block my-3" onClick={e => taskAssignedToMe(e)} >Create Task</button>
            <br />
            <button className="btn btn-primary btn-block" onClick={e => logout(e)} >Logout</button>
        </Fragment>
    );
};

export default Dashboard;