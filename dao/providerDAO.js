import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let flights

export default class FlightsDAO{
    static async injectDB(conn){
        if(flights){
            return
        }
        try{
            flights = await conn.db(process.env.AIRPORTS).collection("schedule")
        }
        catch(e){
            console.error(`Error in establishing connection to collection schedule ${e}`)
        }
    }
    static async getFlights(company){
        let query = {"providerName": {$eq: company}}
        let cursor
        try{
            cursor = await flights.find(query)
        }
        catch(e){
            console.error(`error in fetching flights by company ${e}`)
            return {flightList: [], totalNumFlights: 0}
        }

        try{
            const flightList = await cursor.toArray()
            const totalNumFlights = await flights.countDocuments(query)
            return {flightList, totalNumFlights}
        }
        catch(e){
            console.error(`Error in converting the cursor ${e}`)
            return {flightList: [], totalNumFlights: 0}
        }
    }

    static async addFlights(newFlight,flightId){
        newFlight.flightId = new ObjectId(flightId)
        console.log(newFlight)
        try{
            const res = await flights.insertOne(newFlight)
        }
        catch(e){
            console.error(`error adding flight to DB ${e}`)
        }
    }
}