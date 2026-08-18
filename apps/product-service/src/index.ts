import express,{ Request,Response} from "express"
import {getAuth,clerkMiddleware} from "@clerk/express"
import cors from "cors"
import { shouldBeAuthenticated } from "./middleware/authMiddleware.js"

const app = express()

app.use(cors({
    origin:"*",
    credentials:true
}))
app.use(clerkMiddleware())
app.get("/health",(req:Request,res:Response) => {
    res.status(200).json({
        uptime:process.uptime(),
        timestamp:Date.now()
    })
})

app.get("/test",shouldBeAuthenticated,(req:Request,res:Response) => {
    
    res.status(200).json({
        message:"route is authenticated",
        userId: req.userId
    })
})

app.listen(8003, () => {
    console.log("Product service is running on port 8003")
})