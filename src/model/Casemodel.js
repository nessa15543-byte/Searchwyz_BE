import { Schema } from "mongoose";

const caseSchema = new Schema({
    name:{
        type: string,
        required: true,
    },
    age:{
        type: string,
        required: true,
    },
    height:{
        type: string,
        required: true,
    },
    lastSeen:{
        type: Object,
        required: true,
    },
    photo:{
        type: Object,
        required: true,
    },
    complextion:{
        type: string,
        required: true,
    },
    comment:{
        type: Array,
        required: true,
    },
    status:{
        type: Value,
        required: true, 
    },
})
const caseModel = model("Case", caseSchema)
module.exports = caseModel;