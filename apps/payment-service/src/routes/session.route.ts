import { Hono } from "hono";
import stripe from "../utils/stripe";
import { shouldBeAuthenticated } from "../middleware/authMiddleware";
import { getStripeProductPrice } from "../utils/stripeProdcuts";
import { CartItemsType } from "@repo/types";

const sessionRoute = new Hono();

sessionRoute.post("/create-checkout-session", shouldBeAuthenticated, async (c) => {
    try {
        const { cart }: { cart?: CartItemsType } = await c.req.json();

        if (!cart?.length) {
            return c.json({ error: "Cart is empty" }, 400);
        }

        const userId = c.get("userId");

        const lineItems = await Promise.all(
            cart.map(async (item) => {
                const unitAmount = await getStripeProductPrice(item.id);

                if (unitAmount === null || !Number.isFinite(unitAmount) || unitAmount <= 0) {
                    throw new Error(`Product price not found for product: ${item.name}`);
                }

                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: unitAmount,
                    },
                    quantity: item.quantity,
                };
            })
        );

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            client_reference_id: userId,
            mode: "payment",
            payment_method_types: ["card"],
            ui_mode: "elements",
            return_url: "http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}",
        });
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