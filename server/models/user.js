import { Schema, model } from "mongoose";
const {BASIC_API_LIMIT = 1000, BASIC_EMAIL_LIMIT = 200, MAX_LOGIN_FAIL_ATTEMPT = 5} = process.env
import {generateKey} from "../helper.js"

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 200,
    trim: true
  }, 
  email: {
    type: String,
    required: true,
    unique: true,
    maxLength: 200,
    lowercase: true
  }, 
  password: {
    type: String,
    required: true,
    maxLength: 1000
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    default: "male"
  },
  country: {
    type: String,
    default: "Nigeria"
  },
  role: {
    type: String,
    enum: ["basic", "pro", "admin"],
    default: "basic"
  },
  webhook: {
    type: String,
    maxLength: 500,
    default: null
  },
  apiKey: {
    type: String,
    unique: true,
    default: () => generateKey()
  },
  apiUsage: {
    type: Number,
    default: 0
  },
  emailUsage: {
    type: Number,
    default: 0
  },
  apiTokens: {
    type: Number,
    default: BASIC_API_LIMIT
  },
  emailLimit: {
    type: Number,
    default: BASIC_EMAIL_LIMIT
  },
  notifications: {
    type: String,
    enum: ["all", "badthread", "none"],
    default: "none"
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now()
  },
  loginFailAttempt: {
    type: Number,
    max: MAX_LOGIN_FAIL_ATTEMPT,
    default: 0
  },
  lastFailedLogin: {
    type: Date,
    default: Date.now()
  },
  lastBilling: {
    type: Date, // pro user need to pay billss every month to use api
    default: Date.now()
  }
}, {
  timestamps: true
});
/*
UserSchema.index({ email: 1 });
UserSchema.index({ apiKey: 1 });
UserSchema.index({ createdAt: 1 });
UserSchema.index({ "otpExpires": 1 }, { expireAfterSeconds: 0 });
*/

export default model("Arcane_User", UserSchema);