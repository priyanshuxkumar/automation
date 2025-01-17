import { Router , Response , Request} from "express";
import { CreateWorkflowSchema, UserSignInSchema, UserSignupSchema } from "../types";
import prisma from "@repo/db";
import { authUserMiddleware } from "../middleware/auth.middleware";
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from "../redis/redis";

const router = Router();

router.post("/create" , authUserMiddleware , async(req: Request , res: Response) => {
    const userId = req.id;
    if(!userId){
        res.status(403).json({message : 'Unauthenticated'});
        return;
    }
    const body = req.body;
    const parsedData = CreateWorkflowSchema.safeParse(body);
    if(!parsedData.success) {
        res.status(400).json({message: "Invalid input of creating a workflow"})
        return;
    }


    /**Check URL is already generated or not */
    const cacheUrl = await redisClient.hGet('user_webhook_urls', userId.toString());
    let id: string;
    if(cacheUrl){
        id = (cacheUrl.split('/')[6]).toString()
    }
    try {
       await prisma.$transaction(async(tx) => {
            let workflow;
            if(id){
                workflow = await tx.workflow.create({
                    data: {  
                        id: id,
                        name : parsedData.data.name || "Untitled workflow",
                        userId : userId as number,
                        triggerId: "",
                        actions: {
                            create : parsedData.data?.actions?.map((item , index) => ({
                                actionTypeId: item.actionTypeId as string,
                                sortingOrder: index ,
                                metadata: item.actionMetadata
                            }))
                        }
                    }
                })
            }else{
                workflow = await tx.workflow.create({
                    data: {  
                        name : parsedData.data.name || "Untitled workflow",
                        userId : userId as number,
                        triggerId: "",
                        actions: {
                            create : parsedData.data?.actions?.map((item , index) => ({
                                actionTypeId: item.actionTypeId as string,
                                sortingOrder: index ,
                                metadata: item.actionMetadata
                            }))
                        }
                    }
                })
            }

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

router.get("/get-hook-url",authUserMiddleware, async(req: Request, res: Response) => {
    const userId = req.id;
    if(!userId){
        res.status(403).json({message : 'Unauthenticated'});
        return;
    }

    try {
        const cacheUrl = await redisClient.hGet('user_webhook_urls', userId.toString());
        if(cacheUrl){
            res.status(200).json(cacheUrl);
            return;
        }

        const workflowId = uuidv4();
        const WEBHOOK_URL = `${process.env.HOOK_BACKEND_URL}/hooks/catch/${userId}/${workflowId}`;
        
        /**Make a cache of URL */
        await redisClient.hSet("user_webhook_urls", { [userId.toString()]: WEBHOOK_URL });
        res.status(200).json(WEBHOOK_URL);
    } catch (err) {
      console.log("Error occured while generating Hook url", err);
    }
  }
);

export const workflowRouter = router;