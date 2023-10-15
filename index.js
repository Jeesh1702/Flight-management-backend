import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import providerDAO from "./dao/providerDAO.js"

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
    await providerDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`server listening on port ${port}`)
    })
})