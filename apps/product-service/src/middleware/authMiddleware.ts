import { Request, Response, NextFunction } from "express"
import { getAuth } from "@clerk/express"
import type {CustomJwtSessionClaims} from "@repo/types"

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

export const shouldBeAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const { isAuthenticated, userId } = getAuth(req);
    if(!isAuthenticated) {
        return res.status(401).json({
            message:"route is not authenticated"
        })
    }

    req.userId = userId


    next()
}
export const shouldBeAdmin = (req:Request, res:Response,next:NextFunction) => {
    const {sessionClaims,isAuthenticated, userId} = getAuth(req)
        if(!isAuthenticated){
            return res.status(401).send({
                error:"route is not authenticated"
            })
        }
        const claims = sessionClaims as CustomJwtSessionClaims
        if(claims.metadata?.role !== "admin"){
            return res.status(403).send({
                error: "your not Authorized"
            })
        }
    req.userId = userId

    next()
}