import Fastify from "fastify"
import {getAuth, clerkPlugin, clerkClient} from "@clerk/fastify"

const fastify = Fastify({logger:true})

fastify.register(clerkPlugin)

fastify.get("/health",(request,reply) => {
    reply.status(200).send({
        uptime:process.uptime(),
        timestamp:Date.now()
    })
})

fastify.get("/test",async(request,reply) => {
    try{
        const {isAuthenticated, userId} = getAuth(request)
        if(!isAuthenticated){
            return reply.code(401).send({
                error:"route is not authenticated"
            })
        }
        const user = await clerkClient.users.getUser(userId)
        return reply.code(200).send({
            message: "route is authenticated",
            user,
        })
    }catch(err){
        fastify.log.error(err)
        return reply.code(500).send({
            error:"internal server error"
        })
    }
})

const start = async()=>{
    try{
        await fastify.listen({port:8001})
        console.log("Order service is running on port 8001")

    }catch(err){
        fastify.log.error(err)
        process.exit(1)
    }
}
start()