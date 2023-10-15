import express from "express"
import ProviderController from "../controller/provider.controller.js"
const router = express.Router()

//routes for dashboard
router.route("/dashboard")
.get(ProviderController.apiGetFlights)
.post(ProviderController.apiAddFlight)
.put()
.delete()

export default router