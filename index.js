require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const twilioRouter = require('./routes/twilio-sms');
const app = express();

const {PORT} = process.env;
const port = 8080 || PORT;
const jsonParser = bodyParser.json();


app.use(jsonParser);
app.use('/twilio-sms',twilioRouter);
app.use(cors());
// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin', '*');
// })
app.get('/',(req,res)=>{
    res.send("Twilio-sms-service activated again");
});
// app.get('/',()=>{
//     console.log("Twilio-sms-service activated");
// })
app.post('/', (req, res) => {
    // Handle the POST request
    console.log(req.body);
    res.send('POST request received');
  });

app.listen(port,()=>{
    console.log(`server started listen to the port ${port}`)
})
module.exports = app;
