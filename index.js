require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const twilioRouter = require("./routes/twilio-sms");
const coinbaseRouter = require("./routes/coinbase");
const app = express();

const { PORT } = process.env;
const port = 8080 || PORT;
const jsonParser = bodyParser.json();

app.use(jsonParser);
app.use("/twilio-sms", twilioRouter);
app.use("/coinbase", coinbaseRouter);
app.use(cors("*"));
// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin', '*');
// })
app.get("/", (req, res) => {
  res.send("Twilio-sms-service activated again");
});
const dbURI = "mongodb+srv://Thiru:Gryffindor7@cluster0.96vb1.mongodb.net/UD";

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err.message));

// app.get('/',()=>{
//     console.log("Twilio-sms-service activated");
// })
app.post("/", (req, res) => {
  // Handle the POST request
  console.log(req.body);
  res.send("POST request received");
});

app.listen(port, () => {
  console.log(`server started listen to the port ${port}`);
});
module.exports = app;
