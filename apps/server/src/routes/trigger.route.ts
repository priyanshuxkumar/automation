import { Router , Response , Request} from "express";
import prisma from "@repo/db";
import { CreateTriggerTypeSchema } from "../types";

const router = Router();

router.get("/triggers", async(req : Request, res : Response) => {
    try {
        const triggers = await prisma.triggerType.findMany({})
        res.status(200).json({triggers});
    } catch (error) {
        console.log("Error occured while fetching triggers")
    }
})

router.post("/create" , async(req : Request, res : Response) => {
    const body = req.body;
    const parsedData = CreateTriggerTypeSchema.safeParse(body);
    if(!parsedData){
        res.status(400).json({message: "Invalid input to create Trigger type"})
        return;
    }
    try {
        await prisma.triggerType.create({
            data : {
                name : parsedData.data?.name as string,
                iconUrl : parsedData.data?.iconUrl as string
            }
        })
        res.status(200).json({message : "New trigger added successfully!"});
    } catch (err) {
        console.log("Error occured while creating a trigger type" , err);
    }
})

export const triggerRouter = router;