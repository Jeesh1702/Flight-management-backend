import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let tickets

export default class TicketDAO{
    static async injectDB(conn){
        if(tickets){
            return
        }
        try{
            tickets = await conn.db(process.env.MONGO_DB).collection("tickets")
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

    static async getTicketCounts(flightId,date){
        let count = 0
        try{
            count = await tickets.countDocuments({'bookings.flightId': flightId})
            let response = await tickets.aggregate( [
                { $match: { $and: [{'bookings.flightId': flightId},{'bookings.date': date}]} },
                { $group: { _id: null,sum: { $sum: "$bookings.noOfTickets"}} },
              ] );
            count = await response.toArray()
            if(count.length === 0){
                count = 0
            }
            else{
                count = count[0].sum
            }
        }
        catch(e){
            console.error(e)
        }
        return count
    }

    static async getSeats(flightId,date){
        //let tickets = []
        console.log(typeof(flightId),typeof(date),"yo")
        try{
            const result = await tickets.aggregate([
                {
                    $match: {
                        $and: [{ 'bookings.flightId': flightId }, { 'bookings.date': date }]
                    }
                },
                {
                    $group: {
                        _id: null,
                        combinedTicketList: { $addToSet: '$bookings.ticketList' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        combinedTicketList: 1
                    }
                }
            ]).toArray();

            if (result.length > 0 && result[0].combinedTicketList) {
                console.log(result[0].combinedTicketList.flat());
                return result[0].combinedTicketList.flat();
            } else {
                console.log("No matching records found");
                return [0];
            }
            // count = await tickets.countDocuments({'bookings.flightId': flightId})
            // let response = await tickets.aggregate( [
            //     { $match: { $and: [{'bookings.flightId': flightId},{'bookings.date': date}]} },
            //     { $group: { _id: null,sum: { $sum: "$bookings.noOfTickets"}} },
            //   ] );
            // count = await response.toArray()
            // if(count.length === 0){
            //     count = 0
            // }
            // else{
            //     count = count[0].sum
            // }
        }
        catch(e){
            console.error(e)
        }
        //return tickets
    }
}