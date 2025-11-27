import {Schema, model} from "mongoose";


const Log = new Schema({
  data: {
    type: Object,
    required: true
  }
})


export default model("log", Log)