import {Schema, model} from "mongoose";

const Report = new Schema({
  email: {
    type: String,
    maxLength: 100
  },
  status: {
    type: String,
    enums: ["threat detected", "failed error", "good security", "neutral"]
  },
  body: {
    type: String,
    maxLength: 1000
  },
  response: {
    type: String
  }
})

export default model("Report", Report)