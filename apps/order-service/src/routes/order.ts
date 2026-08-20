import { FastifyInstance } from "fastify";
import { shouldBeAuthenticated,shouldBeAdmin } from "../middleware/authMiddleware";
import {Order} from "@repo/order-db"

export const orderRoute = async (fastify:FastifyInstance) => {
    fastify.get("/user-order",{preHandler:shouldBeAuthenticated},async (request,reply)=>{
        const orders = await Order.find({userId:request.userId})
        return reply.send(orders)
    })
    fastify.get("/orders",{preHandler:shouldBeAdmin},async (request,reply) => {
        const order = await Order.find()
        return reply.send(order)
    })
}