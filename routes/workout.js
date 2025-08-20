const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");
const { verify, verifyAdmin, isLoggedIn } = require("../auth");

router.post("/addWorkout", verify, workoutController.addWorkout);
router.patch("/updateWorkout/:id", verify, workoutController.updateWorkout);
router.delete("/deleteWorkout/:id", verify, workoutController.deleteWorkout);
router.get("/getMyWorkouts", verify, workoutController.getMyWorkouts);
router.patch("/completeWorkoutStatus/:id", verify, workoutController.completeWorkout);

module.exports = router;