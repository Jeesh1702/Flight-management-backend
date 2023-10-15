import express from "express"
import cors from "cors"
import login from "./routes/login.route.js"
import provider from "./routes/provider.route.js"
import customer from "./routes/customer.route.js"


const app = express()

app.use(cors())
app.use(express.json())

app.use("/login",login)
app.use("/provider",provider)
app.use("/customer",customer)
app.use("*",(req,res) => res.status(404).json({error: "not found"}))

export default app