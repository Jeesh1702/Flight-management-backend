import mongoose from "mongoose";
const transactionSchema =new mongoose.Schema({
    flightId:{
        type:Number
    },
    date:{
        type:Date
    },
    custId:{
        type:Number
    },
    time:{
        type:Number
    },
    delay:{
        type:Number
    }
}) 