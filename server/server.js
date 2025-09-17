import express from "express";
const {SERVER_PORT, DB_URI} = process.env;
import {getResponse} from "./helper.js"
import Report from "./models/report.js";
import mongoose from "mongoose"
import {log, logger} from "./middlewares/logger.js"
import cors from "cors"

const app = express();
app.use(express.json())
app.use(logger)
app.use(express.static("./client"))
app.use(cors())


app.post("/security/check", async (req, res) => {
  const stringPayload = JSON.stringify(req.body);
  const {email, body} = req.body;

  try{
  if(!email || !body) return res.status(400).json({
    status: "fail",
    message: "inavlid request, no email or body key"
  })
  
  getResponse([{
    role: "user", 
    content: stringPayload
  }], async (status, aiResponse) =>  {
    const response = JSON.parse(aiResponse);
    if(!status) throw new Error("ai response error");
   
    await Report.create({
      email,
      body,
      status: response.response.status,
      response: response.response.message
    })
    res.json(response);
    console.log(response)
  })
  }catch(er){
     Report.create({
      email,
      body,
      status: "failed",
      message: 'unexpected error - server error: ' + er.message
    })
    res.status(400).json({
      status: "fail",
      message: "unexpected internal error"
    })
  }
})


app.get("/reports", async (req, res) => {
   try{
    const reports = await Report.find({});
    res.json({
      reports,
      found: reports.length > 1,
      length: reports.length
    })
   }catch(er){
     log("error getting reports " + er, "bad")
     res.json({
       found: false,
       reports: [],
       message: 'unexpected error getting reports'
     })
   }
})


app.get("/", (req, res) => {
  res.redirect("/home.html")
})


const start = () => {
app.listen(SERVER_PORT, () => {
  log(`server started at ${SERVER_PORT}, live at http://localhost:${SERVER_PORT}`)
})
}

mongoose.connect(DB_URI)
.then(() => {
  log("database connected, starting a server")
  start()
})
.catch(er => {
  log('error connecting database ' + er, "bad")
})

