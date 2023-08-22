const router = require("express").Router();
const student = require('../controller/student');

router.post('/create', student.createStudent);
router.post("/:id/exercises", student.createExercise);

router.get("/", student.getAllStudents);
router.get("/:id/logs", student.getStudentExerciseLogs);
module.exports = router;
