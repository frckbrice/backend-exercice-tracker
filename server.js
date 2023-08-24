
// declarations
const express = require('express');
require("dotenv").config();
const port = process.env.PORT ||  5000;
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');

// const corsOptions = {
//   origin: ["http://localhost:5173","*"],
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// add middleware
app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/api/exercises', require('./routes/exercise'));
app.use("/api/students", require("./routes/student"));





app.listen(port, () => {
  console.log('server listening on port ' + port);
  mongoose
    .connect(process.env.URI_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connected successfully to database");
    })
    .catch((err) => {
      console.log("Failed to connect to database", err);
    });;
});









