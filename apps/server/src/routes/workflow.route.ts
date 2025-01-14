import { Router , Response , Request} from "express";
import { CreateWorkflowSchema, UserSignInSchema, UserSignupSchema } from "../types";
import prisma from "@repo/db";
import { authUserMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/create" , authUserMiddleware , async(req: Request , res: Response) => {
    const userId = req.id;
    const body = req.body;
    const parsedData = CreateWorkflowSchema.safeParse(body);
    if(!parsedData) {
        res.status(400).json({message: "Invalid input of creating a workflow"})
        return;
    }
    try {
       await prisma.$transaction(async(tx) => {
            const workflow = await tx.workflow.create({
                data: {
                    name : parsedData.data?.name as string,
                    userId : userId as number,
                    triggerId: "",
                    actions: {
                        create : parsedData.data?.actions.map((item , index) => ({
                            actionTypeId: item.actionTypeId,
                            sortingOrder: index,
                            metadata: item.actionMetadata
                        }))
                    }
                }
            })

            const trigger = await tx.trigger.create({
                data: {
                    triggerTypeId : parsedData.data?.triggerTypeId as string,
                    metadata : parsedData.data?.triggerMetadata,
                    workflowId : workflow.id as string
                }
            })

            await prisma.workflow.update({
                where : {
                    id : workflow.id
                },
                data: {
                    triggerId : trigger.id
                }
            })            
       })
       res.status(200).json({message: "Workflow created successfully!"});
    } catch (err) {
        console.log("Error occured while creating workflow", err);
    }
})

export const workflowRouter = router;