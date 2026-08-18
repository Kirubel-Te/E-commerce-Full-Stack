import { Request, Response, NextFunction } from "express"
import { getAuth } from "@clerk/express"

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