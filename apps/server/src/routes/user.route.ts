import { Router , Response , Request} from "express";
import { UserSignInSchema, UserSignupSchema } from "../types";
import prisma from "@repo/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authUserMiddleware } from "../middleware/auth.middleware";
import { sendVerificationEmail } from "../services/email";
import { JWT_SECRET } from "../config/jwt.config";

const router = Router();

router.post("/signup", async(req : Request , res : Response) => {
    const body = req.body;
    const parsedData = UserSignupSchema.safeParse(body);
    if(!parsedData.success){
        res.status(400).json({message: "Invalid input"})
        return;
    }
    try {
        const isUserExists = await prisma.user.findFirst({
            where: {
                email: parsedData.data.email
            }
        })
        if(isUserExists){
            res.status(403).json({message: "User already exists"})
            return;
        }

        const hashPassword = await bcrypt.hash(parsedData.data.password , 10);

        await prisma.user.create({
            data: {
                firstName: parsedData.data.firstname,
                lastName: parsedData.data.lastname,
                username: parsedData.data.username,
                email: parsedData.data.email,
                password: {
                    create: {
                        hash : hashPassword
                    }
                }
            }
        })
        sendVerificationEmail(parsedData.data.email);
        res.status(200).json({message: "Please verify your email"})
        return;
    } catch (err) {
        console.log("Error occured while signup", err); 
    }
})


router.post("/signin", async(req : Request , res : Response) => {
    const body = req.body;
    const parsedData = UserSignInSchema.safeParse(body);
    if(!parsedData.success){
        res.status(400).json({message: "Invalid input"})
        return;
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: parsedData.data.email
            },
            include: {
                password: true
            }
        })
        if(!user){
            res.status(403).json({message: "User doesnot exists"})
            return;
        }

        const isPasswordValid = await bcrypt.compare(parsedData.data.password , user.password?.hash as string);
        if(!isPasswordValid){
            res.status(403).json({message : "Invalid crendentials"});
        }
        const token = jwt.sign({id : user.id} , JWT_SECRET , {expiresIn: '24h'});
        const options = {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: 'strict' as 'strict',
            path: '/',
        }
        res.cookie("_token_", token, options);
        res.status(200).json({ message: "User logged in successfully", token});
    } catch (err) {
        console.log("Error occured while signin", err); 
    }
})

router.get("/" , authUserMiddleware, async(req : Request, res : Response) => {
    const userdId = req.id;
    if(!userdId){
        return
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                id : userdId
            },
            select: {
                firstName: true,
                lastName: true,
                username: true,
                workflows: true
            }
        })
        if(!user){
            res.status(404).json({message : "User not found!"});
            return
        }

        res.status(200).json(user);
    } catch (err) {
        console.log("Error occured while getting user data" , err);
    }
})

router.get("/verify-email", async(req : Request, res : Response) => {
    const token = req.query.token as string;
    try {
        const payload = jwt.verify(token , JWT_SECRET);
        if(typeof payload === "string" || !payload.email) {
            res.status(400).json({message : "Invalid request"})
            return;
        }
        await prisma.user.update({
            where : {
                email : payload.email
            },
            data: {
                isVerified : true
            }
        })
        res.status(200).json({message: "Email verified successfully!"});
    } catch (err) {
        console.log("Error occured while verify user email" , err);
    }
})

export const userRouter = router;