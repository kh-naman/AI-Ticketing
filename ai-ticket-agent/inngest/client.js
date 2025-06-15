import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "AI-Ticketing-System",
  eventKey: process.env.INNGEST_EVENT_KEY
});

