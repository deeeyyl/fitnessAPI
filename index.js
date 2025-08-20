const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const userRoutes = require("./routes/users.js");
const workoutRoutes = require("./routes/workout.js");

const session = require ("express-session");
require("dotenv").config();

const app = express();

app.use(express.json());
const corsOptions = {
    origin: [
        'http://localhost:8000'
    ],
    
        credentials: true,
        optionsSuccessStatus:200
}

app.use(cors(corsOptions));

app.use(session({
    secret: process.env.clientSecret  || "fallback-secret",
    resave: false,
    saveUninitialized: false
}));

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas."));

app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes)

if(require.main === module) {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`API is now online on port ${ process.env.PORT || 3000}`)
    })
}

module.exports = { app, mongoose };