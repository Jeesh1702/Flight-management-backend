import mongoose from "mongoose";
const customer=new mongoose.Schema({
    user: {
        custId: {
        type: Number,
        },
        fullName: {
        type: String,
        required: true,
        },
        email: {
        type: String,
        required: true,
        },
        phone: {
        type: String,
        },
    },
    bookings:{
        date:{
            type:Date,
            required: true
        },
        flightId:{
            type:Number,
            required: true
        },
        noOfTickets:{
            type:Number,
            required: true
        }
    }
})