#***Task Management System***

##***Overview***

The Task Management System is a web application designed to streamline task creation, assignment, and tracking for teams. It allows users to register, log in, create tasks, and manage them based on roles (Admin/User). The system ensures secure access and provides functionality to view tasks assigned by or to a user, as well as all tasks in the system (admin-specific).

##***Features***

###***User Authentication***: Secure login and registration using JWT-based authentication.

###***Role Management***: Admin and User roles with specific permissions.

###***Task Management***:

Create new tasks.

View tasks assigned by the user.

View tasks assigned to the user.

Admin access to view all tasks.

###***Secure API Access***: Token-based authorization for backend APIs.

###***Dynamic Dashboard***: Personalized user experience with role-specific controls.

##***Tech Stack***

###***Frontend***

React.js (with React Router for navigation)

Bootstrap (for styling)

###***Backend***

Node.js

Express.js

###***Database***

PostgreSQL

UUID for primary keys

JSON support for role permissions

###***Other Tools***

JWT for authentication

Fetch API for frontend-backend communication

Nodemailer for sending email notifications
