import {consumer , TOPIC_NAME} from "@repo/kafka-client";
import prisma from "@repo/db"
import { sendEmail } from "./email";

async function main(){
    await consumer.connect();
    console.log("Consumer connected successfully!");

    while(true){
        await consumer.subscribe({topic: TOPIC_NAME , fromBeginning: true})
        await consumer.run({
            autoCommit: false,
            eachMessage: async({topic , partition , message}) => {
                console.log(partition , {
                    offset : message.offset,
                    value : message.value?.toString()
                })

                await new Promise(r => setTimeout(r , 1000));

                /** Perform task of actions */
                const workflowRunId = message.value?.toString();
                const workflow = await prisma.workflowRun.findFirst({
                    where: {
                        id: workflowRunId
                    },
                    select: {
                        workflow:{
                            include: {
                                actions: {
                                    include : {
                                        type: true
                                    }
                                }
                            }
                        }
                    }
                })
                if (workflow?.workflow.actions.some(item => item.type.name === "Email")) {
                    const emailActions = workflow.workflow.actions.filter(item => item.type.name === "Email");
                    emailActions.forEach(action => {
                        const metadata = action.metadata;
                        console.log(JSON.stringify(metadata))
                        sendEmail(metadata); 
                    });
                }
                await consumer.commitOffsets([
                    {
                        topic: TOPIC_NAME,
                        partition: partition,
                        offset: (parseInt(message.offset) + 1).toString()
                    }
                ]);

                console.log("Work done!");
            }
        })
    }
}

main().catch(console.error);