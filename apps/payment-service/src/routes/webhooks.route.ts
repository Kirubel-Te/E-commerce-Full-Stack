import {Hono} from 'hono'
import Stripe from 'stripe'
import stripe from '../utils/stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

const webhooksRoute = new Hono()

webhooksRoute.post('/stripe', async (c) => {
    const body = await c.req.text()
    const signature = c.req.header('stripe-signature')

    let event: Stripe.Event
    try{
        event = stripe.webhooks.constructEvent(body, signature!, webhookSecret)

    }catch(err){
        console.log("webhook verification failed",err)
        return c.json({error: "Webhook verification failed"}, 400)
    }

    switch(event.type){
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
            console.log("Checkout session completed: ", session)
            break
        default:
            break
    }
    return c.json({received: true})
})

export default webhooksRoute