import TicketsDAO from "../dao/ticketsDAO.js"
import FlightsDAO from "../dao/flightsDAO.js"

export default class CustomerController {
    static async apiFetchTickets(req,res,next){
        const custId = (req.query.customerID)
        const {ticketList, totalNumTickets} = await TicketsDAO.getTickets(custId)
        let response = {
            customer: custId,
            tickets: ticketList,
            total_results: totalNumTickets
        }
        res.json(response)
    }
    static async apiSearchFlights(req,res,next){
        let data = {
            "providerName" : (!("providerName" in req.body))? {$exists: true} : {$eq: req.body.providerName},
            "source": {$eq: req.body.source},
            "destination": {$eq: req.body.destination},
            "day.mon": (req.body.day !== 'mon')? {$exists: true} : {$ne: null},
            "day.tue": (req.body.day !== 'tue')? {$exists: true} : {$ne: null},
            "day.wed": (req.body.day !== 'wed')? {$exists: true} : {$ne: null},
            "day.thur": (req.body.day !== 'thur')? {$exists: true} : {$ne: null},
            "day.fri": (req.body.day !== 'fri')? {$exists: true} : {$ne: null},
            "day.sat": (req.body.day !== 'sat')? {$exists: true} : {$ne: null},
            "day.sun": (req.body.day !== 'sun')? {$exists: true} : {$ne: null},
        }
        const {flightList, totalNumFlights} = await FlightsDAO.getFlightBySearch(data)
        let response = {
            flights: flightList,
            total_results: totalNumFlights
        }
        res.json(response)
    } 
    static async apiAddTicket(req,res,next){
        const newTicket = {
            user: {
                custId: req.query.customerID,
                fullName: req.body.user.fullName,
                email: req.body.user.email,
                phone: req.body.user.phone
            },
            bookings: {
                flightId: req.body.bookings.flightId,
                noOfTickets: req.body.bookings.noOfTickets
            }
        }
        try{
            const response = await TicketsDAO.addTickets(newTicket)
            res.json({status : "success"})
        }
        catch(e){
            res.status(500).json({error: e})
        }
    }

    static async apiDeleteTicket(req,res,next){
        try{
            const response = await TicketsDAO.deleteTicket(req.body.ID,req.query.customerID)
            res.json({status: "success"})
        }   
        catch(e){
            console.error(`error deleting flight with id ${flightId} ${e}`)
            res.status(500).json({error: e})
        }
    }

}