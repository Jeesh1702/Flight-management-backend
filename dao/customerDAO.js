import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let tickets

export default class CustomerDAO{
    static async injectDB(conn){
        if(tickets){
            return
        }
        try{
            tickets = await conn.db(process.env.AIRPORTS_DB).collection("tickets")
        }
        catch(e){
            console.error(`Error in establishing connection to collection tickets ${e}`)
        }
    }
    static async getTickets(custID){
        let query = {'user.custId':  custID}
        let cursor
        try{
            cursor = await tickets.find(query)
        }
        catch(e){
            console.error(`error in fetching tickets of customer ${e}`)
            return {ticketList: [], totalNumTickets: 0}
        }

        try{
            const ticketList = await cursor.toArray()
            const totalNumTickets = await tickets.countDocuments(query)
            return {ticketList, totalNumTickets}
        }
        catch(e){
            console.error(`Error in converting the cursor ${e}`)
            return {ticketList: [], totalNumTickets: 0}
        }
    }

    static async addTickets(newTicket){
        try{
            const res = await tickets.insertOne(newTicket)
        }
        catch(e){
            console.error(`error adding ticket to DB ${e}`)
        }
    }

    static async deleteTicket(bookingID, custID){
        try{
            const bd = new ObjectId(bookingID)
            return await tickets.deleteOne({'_id':bd,'user.custId': custID})
        }
        catch(e){
            console.error(`error in delete fun ${e}`)
        }
    }
}