import { Hono } from "hono";
import stripe from "../utils/stripe";
import { shouldBeAuthenticated } from "../middleware/authMiddleware";

const sessionRoute = new Hono()

sessionRoute.post("/create-checkout-session",shouldBeAuthenticated,async (c) => {
    try{
        const session = await stripe.checkout.sessions.create({
        line_items:[
            {
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:"T-shirt",
                    },
                    unit_amount: 2000,
                },
                quantity:1
            }
        ],
        mode:"payment",
        payment_method_types: ["card"],
        ui_mode:"elements",
        return_url:"http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}"
    })
    return c.json({checkoutSessionClientSecret: session.client_secret})
    }catch(error){
        console.log(error)
        return c.json({error})
    }
})

export default sessionRoute