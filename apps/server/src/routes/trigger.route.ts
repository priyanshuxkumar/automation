import { Router , Response , Request} from "express";
import prisma from "@repo/db";

const router = Router();

router.post("/triggers", async(req : Request, res : Response) => {
    try {
        const triggers = await prisma.triggerType.findMany({})
        res.status(200).json({triggers});
    } catch (error) {
        console.log("Error occured while fetching triggers")
    }
})


export const triggerRouter = router;