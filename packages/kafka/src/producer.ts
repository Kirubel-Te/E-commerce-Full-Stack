import type {Kafka, Producer} from 'kafkajs'

export const createProducer = (kafka:Kafka) => {
    const producer:Producer = kafka.producer()

    const connectProducer = async() => {
        await producer.connect()
        console.log(`Producer connected to Kafka`)
    }
    const sendMessage = async(topic:string,message:object) => {
        await producer.send({
            topic,
            messages:[{value:JSON.stringify(message)}]
        })
    }

    const disconnectProducer = async() => {
        await producer.disconnect()
    }

    return{connectProducer,sendMessage,disconnectProducer}
}