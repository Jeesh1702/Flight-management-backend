import CustomerDAO from "../dao/customerDAO.js"

export default class CustomerController {
    static async apiFetchTickets(req,res,next){
        const custId = (req.query.customerID)
        const {ticketList, totalNumTickets} = await CustomerDAO.getTickets(custId)
        let response = {
            customer: custId,
            tickets: ticketList,
            total_results: totalNumTickets
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
            const response = await CustomerDAO.addTickets(newTicket)
            res.json({status : "success"})
        }
        catch(e){
            res.status(500).json({error: e})
        }
    }

    static async apiDeleteTicket(req,res,next){
        try{
            const response = await CustomerDAO.deleteTicket(req.body.ID,req.query.customerID)
            res.json({status: "success"})
        }   
        catch(e){
            console.error(`error deleting flight with id ${flightId} ${e}`)
            res.status(500).json({error: e})
        }
    }

}