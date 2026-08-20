import { config } from "dotenv"
import { fileURLToPath } from "node:url"
import mongoose from "mongoose"

config({ path: fileURLToPath(new URL("../.env", import.meta.url)) })

let isConnected = false

export const connectToDatabase = async () => {
    if(isConnected){
        return
    }
    const connectionString = process.env.MONGODB_URL
    if(!connectionString){
        throw new Error("MONGODB_URL is not configured")

    }
    try{
        await mongoose.connect(connectionString)
        isConnected = true
        console.log("connected to mongoDB")
    }catch(err){
        console.log(err)
        throw err
    }
}