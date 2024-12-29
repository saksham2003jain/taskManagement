CREATE DATABASE taskmanagement;

CREATE TABLE roles(
    role_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name VARCHAR(255) NOT NULL,
    permission JSON NOT NULL
);

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    role_id uuid NOT NULL REFERENCES roles(role_id)
);

CREATE TABLE tasks (
    task_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_title VARCHAR(255) NOT NULL,
    task_description VARCHAR(255) NOT NULL,
    task_assigned_to uuid REFERENCES users(user_id),
    task_assigned_by uuid REFERENCES users(user_id),
    task_status VARCHAR(255) NOT NULL,
    task_priority VARCHAR(255) NOT NULL,
    task_due_date DATE NOT NULL
);




INSERT INTO roles (role_name,permission) VALUES ('admin','{
    "tasks":{
        "create":true,
        "read":true,
        "edit":true,
        "delete":true,
        "assign":true
    }
}');

INSERT INTO roles (role_name,permission) VALUES ('user','{
    "tasks":{
        "create":true,
        "read":true,
        "edit":true,
        "delete":true,
        "assign":false
    }
}');



INSERT INTO users (user_name,user_email,user_password,role_id)  VALUES ('postgtres','postgres@gmail.com','lmno123',(SELECT role_id FROM roles WHERE role_name = 'admin')
);

