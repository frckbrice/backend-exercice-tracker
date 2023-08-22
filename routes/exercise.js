const router = require('express').Router();
const exercise = require('../controller/exercise')






router.get("/", exercise.getAllExercises);
// router.post("/:id/exercises", student.createExercise);

// router.get("/", student.getAllStudents);
// router.get("/:id/logs", student.getStudentExerciseLogs);











module.exports = router;