import TicketsDAO from "../dao/ticketsDAO.js"
import FlightsDAO from "../dao/flightsDAO.js"
import { response } from "express"

export default class CustomerController {
    static async apiFetchTickets(req,res,next){
        const custId = (req.query.customerID)
        const {ticketList, totalNumTickets} = await TicketsDAO.getTickets(custId)
        for(let i=0;i< ticketList.length;i++){
            // console.log(ticketList[i])
            let details = {}
            let flightDetails = await FlightsDAO.getFlightById(ticketList[i].bookings.flightId)
            console.log(flightDetails)
            details.bookingId = ticketList[i]._id
            details.date = ticketList[i].bookings.date
            details.flightId = ticketList[i].bookings.flightId
            details.noOfTickets = ticketList[i].bookings.noOfTickets
            details.providerName = flightDetails.providerName
            details.source = flightDetails.source
            details.destination = flightDetails.destination
            details.cost = ticketList[i].bookings.totalCost
            details.noOfChildren = ticketList[i].bookings.noOfChildren
            ticketList[i] = details
        }
        const listSD = await FlightsDAO.getSrcDstList()
        let response = {
            customer: custId,
            tickets: ticketList,
            total_results: totalNumTickets,
            sourceList: listSD.source,
            destinationList: listSD.destination
        }
        // console.log(response)
        res.json(response)
    }
    static async apiSearchFlights(req,res,next){
        console.log(req.body.date)
        var weekday=new Array(7);
        weekday[1]="mon";
        weekday[2]="tue";
        weekday[3]="wed";
        weekday[4]="thur";
        weekday[5]="fri";
        weekday[6]="sat";
        weekday[0]="sun";
        let day=weekday[req.body.day]
        console.log(day)
        let data = {
            "providerName" : (!("providerName" in req.body))? {$exists: true} : {$eq: req.body.providerName},
            "source": {$eq: req.body.source},
            "destination": (!("destination" in req.body))? {$exists: true} : {$eq: req.body.destination} ,
            "day.mon": (day !== 'mon')? {$exists: true} : {$ne: null},
            "day.tue": (day !== 'tue')? {$exists: true} : {$ne: null},
            "day.wed": (day !== 'wed')? {$exists: true} : {$ne: null},
            "day.thur": (day !== 'thur')? {$exists: true} : {$ne: null},
            "day.fri": (day !== 'fri')? {$exists: true} : {$ne: null},
            "day.sat": (day !== 'sat')? {$exists: true} : {$ne: null},
            "day.sun": (day !== 'sun')? {$exists: true} : {$ne: null},
        }
        const {flightList, totalNumFlights} = await FlightsDAO.getFlightBySearch(data)
        console.log(flightList)
        let response = {
            flights: flightList,
            total_results: totalNumFlights
        }
        res.json(response)
    } 
    static async apiAddTicket(req,res,next){
        console.log(req.body)
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
                noOfTickets: req.body.bookings.noOfTickets,
                noOfChildren: req.body.bookings.noOfChild,
                totalCost: req.body.bookings.totalCost
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
            console.log(noOfTicketsBooked)
        }
        catch(e){
            console.error(`error in getting count of tickets ${e}`)
            res.status(500).json({error: e})
        }
        let noOfTicketsAvailable = Number(details.capacity) - Number(noOfTicketsBooked)
        
        details.noOfTicketsAvailable = noOfTicketsAvailable
        res.json(details)
    }

    static async apiAddReview(req,res,next){
        // console.log(req.body)
        try{
            let response = await FlightsDAO.addReview(req.body.flightId,req.body.custId,req.body.rating,req.body.content)
            // console.log(response)
            res.json(response)
        }
        catch(e){
            console.error(`error in adding review ${e}`)
            res.status(500).json({error: e})
        }
    }
}