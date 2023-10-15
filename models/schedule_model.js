import mongoose from "mongoose";
//import { stringify } from "querystring";
const scheduleSchema= new mongoose.Schema({
    providerName:{
        type:String
    },
    flightId:{
        type:Number
    },
    source:{
        type:String
    },
    destination:{
        type:String
    },
    day:{
        mon:{
            type:String,
            default:null
        },
        tue:{
            type:String,
            default:null
        },
        wed:{
            type:String,
            default:null
        },
        thur:{
            type:String,
            default:null
        },
        fri:{
            type:String,
            default:null
        },
        sat:{
            type:String,
            default:null
        },
        sun:{
            type:String,
            default:null
        }
    },
    capacity:{
        type:Number
    },
    price:{
        type:Number
    }
})

const Model = mongoose.model('Schedule', scheduleSchema);

export default Model