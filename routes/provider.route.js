import express from "express"
import ProviderController from "../controller/provider.controller.js"
const router = express.Router()

//routes for dashboard
router.route("/test").get((req,res)=>{
    console.log("prov test")
    res.json("hello provider")
})
router.route("/dashboard")
.get(ProviderController.apiGetFlights)
.post(ProviderController.apiAddFlight)
.put()
.delete(ProviderController.apiDeleteFlight)

export default router