import { Router , Response , Request} from "express";
import prisma from "@repo/db";

const router = Router();

router.get("/actions", async(req : Request, res : Response) => {
    try {
        const actions = await prisma.actionType.findMany({})
        res.status(200).json({actions});
    } catch (error) {
        console.log("Error occured while fetching actions")
    }
})


export const actionRouter = router;