import express, { Request, Response } from "express";
import prisma from "@repo/db";

const PORT = 8000;
const app = express();
app.use(express.json());


app.post("/hooks/catch/:userId/:workflowId" , async(req: Request , res: Response) => {
    const {workflowId} = req.params;
    const body = req.body

    try {
        //Push to DB
        await prisma.$transaction(async(tx) => {
            const workflowRun = await tx.workflowRun.create({
                data: {
                    workflowId,
                    metadata: body
                }
            }) 
    
            await tx.workflowRunOutbox.create({
                data: {
                    workflowRunId: workflowRun.id
                }
            }) 
        })
        res.status(200).json({message:"Webhook recieved!"})
    } catch (err) {
        console.log("Error occured in hook" , err);   
    }
})

app.listen(PORT , () => {
    console.log("Hooks Server is listening on PORT:", PORT);
})