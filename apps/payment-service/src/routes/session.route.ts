import { Hono } from "hono";
import stripe from "../utils/stripe";
import { shouldBeAuthenticated } from "../middleware/authMiddleware";

const sessionRoute = new Hono()

sessionRoute.post("/create-checkout-session",shouldBeAuthenticated,async (c) => {
    try{
        const body = await c.req.json<{ cart?: Array<{ name: string; price: number; quantity: number }> }>()
        if (!body.cart?.length) {
            return c.json({ error: "Cart is empty" }, 400)
        }

        const session = await stripe.checkout.sessions.create({
        line_items: body.cart.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: { name: item.name },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            })),
        mode:"payment",
        payment_method_types: ["card"],
        ui_mode:"elements",
        return_url:"http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}"
    })
    if (!session.client_secret) {
        return c.json({ error: "Stripe did not return a checkout client secret" }, 502)
    }
    return c.json({checkoutSessionClientSecret: session.client_secret})
    }catch(error){
        console.error(error)
        return c.json({
            error: error instanceof Error ? error.message : "Could not create checkout session",
        }, 500)
    }
})

export default sessionRoute