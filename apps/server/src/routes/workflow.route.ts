import { Router , Response , Request} from "express";
import { CreateWorkflowSchema, UserSignInSchema, UserSignupSchema } from "../types";
import prisma from "@repo/db";
import { authUserMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/create" , authUserMiddleware , async(req: Request , res: Response) => {
    const userId = req.id;
    const body = req.body;
    const parsedData = CreateWorkflowSchema.safeParse(body);

    if(!parsedData.success) {
        res.status(400).json({message: "Invalid input of creating a workflow"})
        return;
    }
    try {
       await prisma.$transaction(async(tx) => {
            const workflow = await tx.workflow.create({
                data: {
                    name : parsedData.data.name,
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
                    triggerTypeId : parsedData.data.triggerTypeId,
                    metadata : parsedData.data?.triggerMetadata,
                    workflowId : workflow.id
                }
            })

            await tx.workflow.update({
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
        return;
    }
})

router.get('/' , authUserMiddleware , async(req: Request , res: Response) => {
    const userId = req.id;
    try {
        const workflows = await prisma.workflow.findMany({
            where: {
                userId 
            },
            include: {
                user: true,
                trigger: {
                    include: {
                        type: true
                    }
                },
                actions: {
                    include: {
                        type: true
                    }
                }
            }
        })
        res.status(200).json(
           workflows.map((item) => {
            return {
              id: item.id,
              name: item.name,
              user: {
                firstname: item.user.firstName,
                lastname: item.user.lastName,
              },
              icons: {
                triggerIcon: item.trigger?.type.iconUrl,
                actionIcons: item.actions.map((action) => action.type.iconUrl)
              },
            };
          }),
        );
    } catch (err) {
        console.log("Error occured while fetching workflow", err);
    }
})

export const workflowRouter = router;