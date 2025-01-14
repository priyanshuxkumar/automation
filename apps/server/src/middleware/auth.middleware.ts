import { NextFunction, Response , Request} from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";


const authUserMiddleware = (req: Request , res:Response , next : NextFunction) : void => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        res.status(401).json({message: "Unauthenticated"});
        return;
    }
    try {
        const payload = jwt.verify(token , JWT_SECRET);
        if(typeof payload !== "string" && payload.id) {
            req.id = payload.id;
            next();
        }else {
            res.status(403).json({ message: "Unauthorized" });
            return
        }
    } catch (error) {
        res.status(401).json({message: "Unauthorized"})
    }
}

export { authUserMiddleware };