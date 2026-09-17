import { model } from "mongoose";

const userSchema = new Schema({
    firsName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
},
{timestamps: true},
);
const userModel = model("User", userSchema);
module.exports = userModel;