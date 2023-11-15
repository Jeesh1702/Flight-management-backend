import express from "express"
import CustomerController from "../controller/customer.controller.js"
const router = express.Router()

router.route("/dashboard")
.get(CustomerController.apiFetchTickets)
.post(CustomerController.apiAddTicket)
.put()
.delete(CustomerController.apiDeleteTicket)

router.route("/search")
.post(CustomerController.apiSearchFlights)

router.route("/flightdetails")
.post(CustomerController.apiGetFlightByID)


router.route("flightgui")
.get(CustomerController.getFlightSelection)
// .post(CustomerController.saveFlightSelection)

export default router

router.route("/review")
.post(CustomerController.apiAddReview)
