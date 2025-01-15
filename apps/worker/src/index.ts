import {consumer , TOPIC_NAME} from "@repo/kafka-client"

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

                await consumer.commitOffsets([
                    {
                        topic: TOPIC_NAME,
                        partition: partition,
                        offset: (parseInt(message.offset) + 1).toString()
                    }
                ]);

                console.log("Complete successfully!");
            }
        })
    }
}

main().catch(console.error);