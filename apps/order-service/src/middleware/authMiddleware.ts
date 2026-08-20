import { FastifyRequest, FastifyReply } from "fastify";
import { getAuth } from "@clerk/fastify";
import type {CustomJwtSessionClaims} from "@repo/types"

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
export const shouldBeAdmin = async(request:FastifyRequest, reply:FastifyReply) => {
    const {sessionClaims,isAuthenticated, userId} = getAuth(request)
        if(!isAuthenticated){
            return reply.code(401).send({
                error:"route is not authenticated"
            })
        }
        const claims = sessionClaims as CustomJwtSessionClaims
        if(claims.metadata?.role !== "admin"){
            return reply.code(403).send({
                error: "your not Authorized"
            })
        }
    request.userId = userId
}