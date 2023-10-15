import mongoose from "mongoose";
const customer=new mongoose.Schema({
    user: {
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
        flightId:{
            type:Number
        }
    }
    
})