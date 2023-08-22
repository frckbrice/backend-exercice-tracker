const Student = require("../models/student");
const Exercise = require("../models/exercise");
const expressAsyncHandler = require("express-async-handler");


module.exports = {

  // create a new exercice
  getAllExercises: expressAsyncHandler(async(req, res) => {
    try {
      return res.json(await Exercise.find().populate("student").exec());
    } catch (error) {
      console.log("An error occurred while fetching exercise from database")

     return res.json({
       msg: "An error occurred while fetching exercise from database", error
     });
    }
    
  })
}