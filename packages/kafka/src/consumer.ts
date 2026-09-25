import type {Kafka, Consumer} from 'kafkajs'

export const createConsumer = (kafka:Kafka,groupId:string) => {
    const consumer:Consumer = kafka.consumer({groupId})

    const connectConsumer = async() => {
        await consumer.connect()
        console.log(`Consumer connected to Kafka with groupId: ${groupId}`)
    }
    const receiveMessage = async(topic:string,handler:(message:any)=>Promise<void>) => {
        await consumer.subscribe({topic:topic,fromBeginning:true})
        await consumer.run({
            eachMessage: async ({topic,partition,message}) => {
                try{
                    const value = message.value?.toString()
                    if(value){
                        await handler(JSON.parse(value))
                    }
                }catch(err){
                    console.error(`Error occurred while processing message from topic ${topic}:`, err)
                }
            }
        })
    }

    const disconnectConsumer = async() => {
        await consumer.disconnect()
    }

    return{connectConsumer,receiveMessage,disconnectConsumer}
}