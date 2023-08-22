const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const exerciseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "the exercise must have a description"],
    },
    duration: {
      type: Number,
      required: [true, "an exercise must have a duration"],
    },
    date: {
      type: Date,
      required: [true, "an exercise must have a date"],
    },
    student: { type: mongoose.Types.ObjectId, ref: "Student" },
  },
  {
    timestamps: true,
  }
);

// //* virtual for student url
exerciseSchema.virtual("formatedDate").get(function () {
  return DateTime.fromJSDate(this.date).toISODate();
});

module.exports = mongoose.model("Exercise", exerciseSchema);

