import Fastify from "fastify"
import {getAuth, clerkPlugin, clerkClient} from "@clerk/fastify"
import { shouldBeAuthenticated } from "./middleware/authMiddleware.js"
import { orderRoute } from "./routes/order.js"
import { connectToDatabase } from "@repo/order-db"

const fastify = Fastify()

fastify.register(clerkPlugin)

fastify.get("/health",(request,reply) => {
    reply.status(200).send({
        uptime:process.uptime(),
        timestamp:Date.now()
    })
})

fastify.get("/test",{preValidation:[shouldBeAuthenticated]},async(request,reply) => {
    try{
    
        return reply.code(200).send({
            message: "route is authenticated",
            userId: request.userId,
        })
    }catch(err){
        fastify.log.error(err)
        return reply.code(500).send({
            error:"internal server error"
        })
    }
})
fastify.register(orderRoute)

const start = async()=>{
    try{
        await connectToDatabase()
        await fastify.listen({port:8001})
        console.log("Order service is running on port 8001")

    }catch(err){
        fastify.log.error(err)
        process.exit(1)
    }
}
start()