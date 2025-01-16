import { Router , Response , Request} from "express";
import prisma from "@repo/db";
import { CreateActionTypeSchema } from "../types";

const router = Router();

router.get("/actions", async(req : Request, res : Response) => {
    try {
        const actions = await prisma.actionType.findMany({})
        res.status(200).json(actions);
    } catch (error) {
        console.log("Error occured while fetching actions")
    }
})

router.post("/create" , async(req : Request, res : Response) => {
    const body = req.body;
    const parsedData = CreateActionTypeSchema.safeParse(body);
    if(!parsedData){
        res.status(400).json({message: "Invalid input to create Action type"})
        return;
    }

    try {
        await prisma.actionType.create({
            data : {
                name : parsedData.data?.name as string,
                iconUrl : parsedData.data?.iconUrl as string
            }
        })
        res.status(200).json({message : "New Action added successfully!"});
    } catch (err) {
        console.log("Error occured while creating a action type" , err);
    }
})


export const actionRouter = router;