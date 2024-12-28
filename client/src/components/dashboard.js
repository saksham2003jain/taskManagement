import React, { Fragment, useState, useEffect } from "react";

const Dashboard = ({ setAuth }) => {

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
            console.log(parseRes);

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
            <button className="btn btn-primary btn-block" onClick={e => logout(e)} >Logout</button>
        </Fragment>
    );
};

export default Dashboard;