import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let flights

export default class FlightsDAO{
    static async injectDB(conn){
        if(flights){
            return
        }
        try{
            flights = await conn.db(process.env.MONGO_DB).collection("schedule")
            console.log("Connected to DB")
        }
        catch(e){
            console.error(`Error in establishing connection to collection schedule ${e}`)
        }
    }

    static async getSrcDstList(){
        try{
            const src = await flights.distinct('source')
            const dst = await flights.distinct('destination')
            return {source: src, destination: dst}
        }
        catch(e){
            console.error("error in getting list of sources",e)
            return {source: [], destination: []}
        }
    }

    static async getFlightBySearch(data){
        // console.log(data)
        let cursor
        try{
            cursor = await flights.find(data)
        }
        catch(e){
            console.error(`error in fetching flights by search ${e}`)
            return {flightList: [], totalNumFlights: 0}
        }

        try{
            const flightList = await cursor.toArray()
            const totalNumFlights = await flights.countDocuments(data)
            return {flightList, totalNumFlights}
        }
        catch(e){
            console.error(`Error in converting the cursor ${e}`)
            return {flightList: [], totalNumFlights: 0}
        }
    }

    static async getFlightById(id){
        try{
            const fid = new ObjectId(id)
            let flight = await flights.findOne({"_id": fid})
            return flight
        }
        catch(e){
            console.error("Error",e)
            return {}
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

    static async addFlights(newFlight){
        try{
            const res = await flights.insertOne(newFlight)
        }
        catch(e){
            console.error(`error adding flight to DB ${e}`)
        }
    }
 
    static async deleteFlight(flightId,company){
        try{
            const fid = new ObjectId(flightId)
            console.log(fid,company,flightId)
            return await flights.deleteOne({_id: fid, providerName: company})
        }
        catch(e){
            console.error(`error in delete fun ${e}`)
        }
    }
}