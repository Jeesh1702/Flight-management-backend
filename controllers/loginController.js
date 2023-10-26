// import { createRequire } from "module"
// const Customer= require("../models/customer_model.js")
// //const {findOne}=
// //const mongoose=require("mongoose")
// //import Customer from "../models/customer_model"
// //import mongoose from "mongoose"
// //const require 
// import md5 from "md5"

// const signup=async(req, res)=>{
//     //let newuser;
//     try{
//         const newuser = new Customer({
//             user:{
//                 fullName:res.body.name,
//                 email:res.body.email,
//                 phone:res.body.phone
//             },
//             password: md5(req.body.password),
//             cust:res.body.tf
//         })
//         await newuser.save(function(err){
//             if(err){
//                 console.log(err);
//             }else{
//                 res.redirect("/login")
//             }
//         })
//     }catch(e){
//         console.log("error in register");
//         console.log(e);
//     }
// }

// // const login =async(req, res)=>{
// //     username=req.body.username
// //     const pchek=md5(req.body.password)

// //     Customer.findOne({fullName.user:username})
// // }
import ProviderDAO from "../dao/providerDAO.js"
