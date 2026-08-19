import express,{ Request,Response,NextFunction} from "express"
import {getAuth,clerkMiddleware} from "@clerk/express"
import cors from "cors"
import { router as categoryRouter } from "./routes/category.route.js"
import { router as productRouter } from "./routes/product.route.js"
import { shouldBeAuthenticated } from "./middleware/authMiddleware.js"

const app = express()

app.use(cors({
    origin:"*",
    credentials:true
}))
app.use(express.json())
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

app.use("/category",categoryRouter)
app.use("/product",productRouter)

app.use((err:any, req:Request, res:Response, next:NextFunction) => {
    console.error(err)
    return res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    })
})

app.listen(8004, () => {
    console.log("Product service is running on port 8000")
})