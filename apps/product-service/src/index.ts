import express,{ Request,Response} from "express"
import cors from "cors"

const app = express()

app.use(cors({
    origin:"*",
    credentials:true
}))

app.get("/health",(req:Request,res:Response) => {
    res.status(200).json({
        uptime:process.uptime(),
        timestamp:Date.now()
    })
})

app.listen(8003, () => {
    console.log("Product service is running on port 8003")
})