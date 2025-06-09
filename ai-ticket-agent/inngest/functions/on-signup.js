import { NonRetriableError } from 'inngest'
import User from '../../models/user.js'
import {inngest} from '../client.js'
import { sendMail } from '../../utils/mailer.js'

export const onUserSignup = inngest.createFunction(
    { id: "on-signup", retries: 2 },
    { event: "user/signup" },
    async ({event,step}) => {
        try {
            const {email} = event.data
            const user = await step.run("get-user-from-email",async() => {
                const userObject = User.findOne({email})
                if(!userObject)
                {
                    throw new NonRetriableError("User no longer exist in our db")
                }

                return userObject
            })

            await step.run("send-signup-email", async()=>{
                const subject = `Welcome to the AI-Driven ticketing system`
                const message = `Hello,
                \n\n
                Thanks for signing up, ready to unleash the AI-driven ticketing system?!!
                `
                await sendMail(user.email,subject,message)
            })

            return {succes: true}
        } catch (error) {
            console.error("❌ Error running step",error.message);
            return {succes: false}
            
        }
    }
)
