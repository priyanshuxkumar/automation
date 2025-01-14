import { Router , Response , Request} from "express";
import { UserSignInSchema, UserSignupSchema } from "../types";
import prisma from "@repo/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { authMiddleware } from "../middleware/auth.middleware";

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

        res.status(200).json({message: "User signup successfully!"})
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

        const token = jwt.sign({id : user.id} , JWT_SECRET);
        const options = {
            httpOnly : true,
            secure : true,
            maxAge: 1000 * 60 * 60 * 24
        }

        res.status(200).cookie("__token__" , token , options).json({message : "User logged in successfully", token});
        return;
       
    } catch (err) {
        console.log("Error occured while signin", err); 
    }
})

router.get("/" , authMiddleware ,async(req : Request, res : Response) => {
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

export const userRouter = router;