const express = require("express");
const app = express();
const cors = require("cors");

//middleware
app.use(express.json());
app.use(cors());

// Routes //

// Register and Login routes
app.use("/auth", require("./routes/jwtAuth"));

// dashboard routes
app.use("/dashboard", require("./routes/dashboard"));

// task routes
app.use("/task", require("./routes/task"));




app.listen(5000, () => {
    console.log("server is running on port 5000");
});