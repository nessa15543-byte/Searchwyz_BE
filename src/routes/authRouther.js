import express from "express"
import {
    register,
}from "../controllers/auth.controllers.js"

const authRouther = express.Router();

authRouther.post("/register",register)

module.exports = authRouther;