import { NonRetriableError } from 'inngest'
import User from '../../models/user.js'
import Ticket from '../../models/ticket.js'
import {inngest} from '../client.js'
import { sendMail } from '../../utils/mailer.js'
import analyzeTicket from '../../utils/ai.js'

export const onTicketCreated = inngest.createFunction(

    { id: "on-ticket-created", retries: 2 },
    { event: "ticket/created" },

    //step 1 fetch the whole ticket
    //step 2 change the status of the ticket
    //step 3 update the relevant info w the help of ai agent and extract relevant skills required to solve the issue
    //step 4 time to assign the ticket to moderator, you got the required skills, not match with the relevant user who is a moderator 
    //step 5 actually assign to the moderator, can club with the above steps
    //step 6 optional, let's send the mail to the person who got the ticket assigned with some helpful details of the ticket to get a glimpse

    async ({event,step}) => {
        try {
        const {ticketId} = event.data
        
        const ticket = await step.run("get-ticket-from-ticketId",async() => {
            const ticketObject = await Ticket.findById(ticketId)

            if(!ticketObject)
            {
                throw new NonRetriableError("Ticket no longer exist in our db")
            }
            return ticketObject
        })
        // console.log("Step get-ticket-from-ticketId done");
        await step.run("change-ticket-status",async()=>{
            await Ticket.findByIdAndUpdate(ticket._id,{status: "TODO"})
        })
        // console.log("Step change-ticket-status done");
        
        // const aiResponse = await step.run("get-ticket-info-from-AI",async() => {
        //     return await analyzeTicket(ticket)
        // })
        const aiResponse = await analyzeTicket(ticket);
        // const aiResponse = await analyzeTicket(ticket);
        // console.log("Step get-ticket-info-from-AI done");
        //    sample aiResponse 
        //     {
        //     "summary": "Short summary of the ticket",
        //     "priority": "high",
        //     "helpfulNotes": "Here are useful tips...",
        //     "relatedSkills": ["React", "Node.js"]
        //     }

        // console.log("before ai processing");
        const relatedSkills = await step.run("ai-processing", async () => {
            let skills = [];
            if (aiResponse) {
            await Ticket.findByIdAndUpdate(ticket._id, {
                priority: !["low", "medium", "high"].includes(aiResponse.priority)
              ? "medium"
              : aiResponse.priority,
              helpfulNotes: aiResponse.helpfulNotes,
            status: "IN_PROGRESS",
            relatedSkills: aiResponse.relatedSkills,
            })
            skills = aiResponse.relatedSkills
            }
            return skills
        })
            
        // console.log("before assinging moderator");
        const moderator = await step.run("assigning-moderator",async() => {
            let user = await User.findOne({
                role: "moderator",
                skills: {
                    $elemMatch: {
                        $regex: relatedSkills.join("|"),
                        $options: "i"
                    }
                }
            })
            // console.log("userrr",user);
            
            if (!user) {
            // console.log("No moderator found, gonna find admin");
            
            user = await User.findOne({
                role: "admin",
            });
            // console.log("admin user is it",user);
        }
        
            await Ticket.findByIdAndUpdate(ticket._id, {
            assignedTo: user?._id || null,
            });
            return user;
        
        })
        // console.log("After assinging moderator");
        await step.run("send-email-to-moderator", async() => {
            if(moderator)
            {
                await sendMail(moderator.email, "Ticket assigned",`A new ticket is assigned. Title: ${ticket.title}`)
            }
        })

        return {success: true}
    }
        catch (error) {
            console.error("❌ Error running the step", error.message);
            return { success: false };
        }
        
    }
)