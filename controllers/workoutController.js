const Workout = require("../models/workoutModel");

exports.addWorkout = async (req, res) => {
    try {
        const workout = new Workout({
            userId: req.user.id,
            name: req.body.name,
            duration: req.body.duration
        });

        await workout.save();
        res.status(201).json(workout);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateWorkout = async (req, res) => {
    try {
        const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: "Workout not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteWorkout = async (req, res) => {
    try {
        const deleted = await Workout.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Workout not found" });
        res.json({ message: "Workout deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getMyWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.user.id });
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.completeWorkout = async (req, res) => {
    try {
        const { id } = req.params;

        const workout = await Workout.findByIdAndUpdate(
            id,
            { status: "completed" },
            { new: true, runValidators: true }
        );

        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }

        res.json({
            message: "Workout marked as completed",
            workout
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};