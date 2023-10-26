import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import ProviderDAO from "./dao/providerDAO.js"
import CustomerDAO from "./dao/customerDAO.js"
import login from "./routes/login.route.js"
import mysql from "mysql2"
import cors from "cors"
import express from "express"
//const mysql = require('mysql2');




console.log("hey")

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'vendhan',
  database: 'airport'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
    
    // Execute the SELECT database() query
    
  }
});




dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000
MongoClient.connect(
    process.env.AIRPORTS_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }
)
.catch(err => {
   console.error(err.stack)
   process.exit(1) 
})
.then(async client => {
    await ProviderDAO.injectDB(client)
    await CustomerDAO.injectDB(client)
    
    

    app.listen(port, () => {
        console.log(`server listening on port ${port}`)
    })
})

export default connection;

