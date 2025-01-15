import prisma from "@repo/db";
import { producer , TOPIC_NAME } from "@repo/kafka-client"

async function main(){
    await producer.connect();
    console.log("Producer connect successfully!");

    while(true){
        const pendingRows = await prisma.workflowRunOutbox.findMany({
            where: {},
            take: 10
        })

        producer.send({
            topic: TOPIC_NAME,
            messages: pendingRows.map((row: any) => ({
                value: row.workflowRunId,
            }))
        })

        await prisma.workflowRunOutbox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map((row : any) => row.id) 
                }
            }
        })
    }
}

main().catch(console.error)