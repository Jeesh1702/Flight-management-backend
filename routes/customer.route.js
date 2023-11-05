import express from "express"
import CustomerController from "../controller/customer.controller.js"
const router = express.Router()

router.route("/dashboard")
.get(CustomerController.apiFetchTickets)
.post(CustomerController.apiAddTicket)
.put()
.delete(CustomerController.apiDeleteTicket)

router.route("/search")
.get(CustomerController.apiSearchFlights)
export default router