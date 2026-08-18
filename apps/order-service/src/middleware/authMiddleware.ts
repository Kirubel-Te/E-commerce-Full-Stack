import { FastifyRequest, FastifyReply } from "fastify";
import { getAuth } from "@clerk/fastify";

declare module "fastify"{
    interface FastifyRequest{
        userId?: string
    }
}

export const shouldBeAuthenticated = async(request:FastifyRequest, reply:FastifyReply) => {
    const {isAuthenticated, userId} = getAuth(request)
        if(!isAuthenticated){
            return reply.code(401).send({
                error:"route is not authenticated"
            })
        }
    request.userId = userId
}