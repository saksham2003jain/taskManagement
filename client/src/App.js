import React, { Fragment, useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Dashboard from './components/dashboard';
import Register from './components/register';
import Login from './components/login';
import TasksPage from './components/tasksPages';
import CreateTask from './components/createTask';
import UpdateTask from './components/updateTask';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };
  async function isAuth() {
    try {
      const response = await fetch("http://3.108.52.224:5000/auth/is-verify", {
        method: "GET",
        headers: { token: localStorage.token }
      });

      const parseRes = await response.json();
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
      console.log(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  }
  useEffect(() => {
    isAuth()
  });
  return (
    <Fragment>
      <Router>
        <div className='container'>
          <Routes>
            <Route path='/' element={<Navigate to="/login" />} />
            <Route path="/login" element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Dashboard setAuth={setAuth} />} />
            <Route path="/register" element={!isAuthenticated ? <Register setAuth={setAuth} /> : <Dashboard setAuth={setAuth} />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" />} />
            <Route path="/tasks" element={isAuthenticated ? <TasksPage /> : <Navigate to="/login" />} />
            <Route path="/createTask" element={isAuthenticated ? <CreateTask /> : <Navigate to="/login" />} />
            <Route path="/updateTask" element={isAuthenticated ? <UpdateTask /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
