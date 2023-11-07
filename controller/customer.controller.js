import TicketsDAO from "../dao/ticketsDAO.js"
import FlightsDAO from "../dao/flightsDAO.js"

export default class CustomerController {
    static async apiFetchTickets(req,res,next){
        const custId = (req.query.customerID)
        const {ticketList, totalNumTickets} = await TicketsDAO.getTickets(custId)
        for(let i=0;i< ticketList.length;i++){
            let details = {}
            let flightDetails = await FlightsDAO.getFlightById(ticketList[i].bookings.flightId)
            details.bookingId = ticketList[i]._id
            details.date = ticketList[i].bookings.date
            details.flightId = ticketList[i].bookings.flightId
            details.noOfTickets = ticketList[i].bookings.noOfTickets
            details.providerName = flightDetails.providerName
            details.source = flightDetails.source
            details.destination = flightDetails.destination
            details.cost = flightDetails.price
            ticketList[i] = details
        }
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
                date: req.body.bookings.date,
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
            console.error(`error deleting ticket with id ${req.body.ID} ${e}`)
            res.status(500).json({error: e})
        }
    }

    static async apiGetFlightByID(req,res,next){
        let details
        let noOfTicketsBooked
        try{
            details = await FlightsDAO.getFlightById(req.body.id)
        }
        catch(e){
            console.error(`error fetching flight id ${req.body.ID} ${e}`)
            res.status(500).json({error: e})
        }
        try{
            noOfTicketsBooked = await TicketsDAO.getTicketCounts(req.body.id,req.body.date)
        }
        catch(e){
            console.error(`error in getting count of tickets ${e}`)
            res.status(500).json({error: e})
        }
        let noOfTicketsAvailable = Number(details.capacity) - noOfTicketsBooked
        details.noOfTicketsAvailable = noOfTicketsAvailable
        res.json(details)
    }
    static async apiGetSrcDstList(req,res,next){
        try{
            const response = await FlightsDAO.getSrcDstList()
            res.json(response)
        }
        catch(e){
            console.error(`error in fetching list of src and dst ${e}`)
            res.status(500).json({error: e})
        }
    }
}