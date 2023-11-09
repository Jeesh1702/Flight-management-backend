import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import FlightsDAO from "./dao/flightsDAO.js"
import TicketsDAO from "./dao/ticketsDAO.js"
import {injectDB} from "./routes/login.route.js"
import mysql2 from "mysql2"

dotenv.config()

const connection = mysql2.createConnection({
  host: 'localhost',
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DB
});

const MongoClient = mongodb.MongoClient

const port = process.env.MONGO_PORT || 8000
MongoClient.connect(
    process.env.MONGO_DB_URI,
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
    await FlightsDAO.injectDB(client)
    await TicketsDAO.injectDB(client)
    await injectDB(connection)
    app.listen(port, () => {
        console.log(`server listening on port ${port}`)
    })
})

