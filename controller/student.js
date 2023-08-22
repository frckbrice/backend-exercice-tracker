const Student = require("../models/student");
const Exercise = require("../models/exercise");
const asyncHandlers = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const exercise = require("../models/exercise");

module.exports = {
  // create a new student
  createStudent: [
    // sanitization
    body("name", "name must not be empty").trim().isLength({ min: 3 }).escape(),

    asyncHandlers(async (req, res, next) => {
      // validation to get all errors from precedent sanitization
      const errors = validationResult(req);

      const student = new Student({
        name: req.body.name,
      });

      if (!errors.isEmpty()) {
        res
          .status(400)
          .json({ message: "Bad credentials", student, error: errors.array() });
      } else {
        // verify if the student already exists
        const studentExists = await Student.findById(student._id).exec();
        if (studentExists) {
          console.log("Student already exists");
          return res.json({ message: "student already exists", studentExists });
        } else {
          student.save();
          return res.json({ message: "student added successfully", student });
        }
      }
    }),
  ],

  // get all students
  getAllStudents: asyncHandlers(async (req, res) => {
    const students = await Student.find().orFail(
      new Error("Students not found")
    );
    if (students.length) {
      res.status(200).json({ message: "students found", data: students });
    }
  }),

  // create exercise

  createExercise: [
    body("id", "exercise must have an student id").trim().escape(),
    body("description", "descriptions must not be empty").trim().escape(),
    body("duration", "duration must not be empty").trim().escape(),
    body("date", "date must not be empty")
      .optional({ values: "falsy" })
      .isISO8601()
      .toDate(),

    asyncHandlers(async (req, res) => {
      const errors = validationResult(req);
      console.log(req.body);
      const student = await Student.findById(req.params.id).exec();
      if (student) {
        const exercise = new Exercise({
          student: req.body.id,
          description: req.body.description,
          duration: req.body.duration,
          date: req.body.date,
        });
        const createdExo = await Exercise.create(exercise);

        createdExo
          ? {
              result: res.json({ msg: "Exercise Created successfully", createdExo }),
              log: console.log(createdExo),
            }
          : "";
      } else {
        return res.send(
          "Can not add student to the exercise because student not found"
        );
      }

      if (!errors.isEmpty()) {
        res
          .status(400)
          .json({ msg: "Fields are not well filled", errors: errors.array() });
      }
    }),
  ],

  // get student's exercises log
  getStudentExerciseLogs: asyncHandlers(async (req, res) => {
    const { id } = req.params;
    const { from, to, limit } = req.query;
    let studentExercises = {};
    let student = {};
    try {
      if (mongoose.isValidObjectId(id)) {
        student = await Student.findById(id).exec();

        if (!from && !to) {
          console.log("No req.query");
          studentExercises = await Exercise.find({
            student: id,
          }).exec();
          if (!studentExercises) {
            return res.json({
              _id: id,
              name: student.name,
              count: 0,
              log: [],
            });
          } else {
            return res.json({
              _id: id,
              name: student.name,
              count: studentExercises.length,
              log: studentExercises,
            });
          }
        } else {
          let query = {};
          let date = {};

          query["student"] = id;
          if (from) {
            date["$gte"] = new Date(from);
          }
          if (to) {
            date["$lte"] = new Date(to);
          }
          if (from || to) {
            query.date = date;
          }
          studentExercises = await Exercise.find(query).limit(limit).exec();
          if (!studentExercises) {
            return res.json({
              _id: id,
             name: student.name,
              count: 0,
              log: [],
            });
          } else {
            return res.json({
              _id: id,
             name: student.name,
              count: studentExercises.length,
              log: studentExercises,
            });
          }
        }
      }
    } catch (error) {
      console.log(
        "An Error occurred while fetching data from data base.",
        error
      );
      return res.json({
        msg: "An Error occurred while fetching data from data base",
        error,
      });
    }
  }),
};
