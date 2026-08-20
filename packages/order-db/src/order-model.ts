import mongoose, { InferSchemaType, model } from "mongoose"
import { timeStamp } from "node:console"

const {Schema} = mongoose

export const status = ["success","failed"] as const

const OrderSchema = new Schema({
    userId:{type:String, required:true},
    email:{type:String , required: true},
    amount:{type:Number, requried:true},
    status:{type:String, requried:true, enum:status},
    products:{type:[
        {
            name:{type:String, required:true},
            quantity:{type:Number,required:true},
            price:{type:Number, required:true}
        },
    ], required:true}

},{timestamps:true})

export type OrderSchemaType = InferSchemaType<typeof OrderSchema>

export const Order = model<OrderSchemaType>("Order",OrderSchema)