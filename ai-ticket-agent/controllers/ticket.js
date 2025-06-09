import Ticket from "../models/ticket.js"
import {inngest} from "../inngest/client.js"


export const createTicket = async(req,res) => {
    try {
        const {title,description} = req.body
        if(!title || !description)
        {
            return res.status(400).json({
                message: "Title and description are mandatory"
            })
        }

        const newTicket = Ticket.create({
            title,
            description,
            createdBy: req.user._id.toString()
        })

        await inngest.send({
            name: "ticket/created",
            data: {
                ticketId: newTicket._id.toString()
            }
        })

        return res.status(201).json({
            message: "Ticket created successfully",
            ticket: newTicket
        })
    } catch (error) {
        console.error("Error creating ticket",error.message);
        return res.status(500).json({message: "Internal server error"})
        
    }
}

export const getTickets = async (req,res) => {
    try {
        let tickets = [];
        const user = req.user //assuming authenticate middleware will take care
        if(user.role !== "user")
        {
            tickets = Ticket.find({})
            .populate("assignedTo", ["email", "_id"])
            .sort({ createdAt: -1 });
        }
        else
        {
            tickets = Ticket.find({createdBy: user._id})
            .select("title description status createdAt")
            .sort({ createdAt: -1 });
        }

        return res.status(200).json(tickets);

    } catch (error) {
        console.error("Error fetching tickets", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getTicket = async(req,res) => {
    
    try {
        const user = req.user
        const ticketId = req.params.id

        if(user.role !== "user")
        {
            Ticket.findById(ticketId).populate(assignedTo,["email", "_id"])
        }
        else{
            Ticket.findOne(
                {
                    createdBy: user._id,
                    _id: ticketId
                }
            ).select("title description status createdAt")
        }

        if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
        }
        return res.status(404).json({ ticket });
    } catch (error) {
        console.error("Error fetching ticket", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    
}