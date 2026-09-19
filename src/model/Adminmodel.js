import { Schema } from "mongoose";

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})
const adminModel = model("admin", adminSchema)
module.exports = adminModel