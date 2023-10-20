import ProviderDAO from "../dao/providerDAO.js"
import Schedule from "../models/schedule_model.js"

export default class ProviderController {
    static async apiGetFlights(req,res,next){
        const company = req.query.company
        const {flightList, totalNumFlights} = await ProviderDAO.getFlights(company)
        let response = {
            provider: company,
            flights: flightList,
            total_results: totalNumFlights
        }
        res.json(response)
    }
    static async apiAddFlight(req,res,next){
        console.log("Adding flight....")
        const newFlight = {
            providerName: req.body.providerName,
            flightId: req.body.flightId,
            source: req.body.source,
            destination: req.body.destination,
            day: {
                mon: req.body.day.mon,
                tue: req.body.day.tue,
                wed: req.body.day.wed,
                thur: req.body.day.thur,
                fri: req.body.day.fri,
                sat: req.body.day.sat,
                sun: req.body.day.sun,
            },
            capacity: req.body.capacity,
            price: req.body.price
        }
        try{
            const response = await ProviderDAO.addFlights(newFlight)
            // console.log(response)
            res.json({status : "success"})
        }
        catch(e){
            res.status(500).json({error: e})
        }
    }

    static async apiUpdateFlight(req,res,next){
        
    }

    static async apiDeleteFlight(req,res,next){
        console.log("deleting flight")
        try{
            const response = await ProviderDAO.deleteFlight(req.body.flightId,req.query.company)
            console.log(response)
            res.json({status: "success"})
        }   
        catch(e){
            console.error(`error deleting flight with id ${flightId} ${e}`)
            res.status(500).json({error: e})
        }
    }
}