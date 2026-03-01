import { type NextRequest, NextResponse } from "next/server";
import { db } from "#lib/db";
import { getStripeClient } from "#lib/stripe";

export async function POST(request: NextRequest) {
	const body = await request.text();
	const signature = request.headers.get("stripe-signature");

	if (!signature) {
		return NextResponse.json({ error: "Missing signature" }, { status: 400 });
	}

	const stripe = getStripeClient();

	let event: ReturnType<typeof stripe.webhooks.constructEvent> extends infer T
		? T
		: never;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET,
		);
	} catch (err) {
		console.error("Webhook signature verification failed:", err);
		return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
	}

	switch (event.type) {
		case "checkout.session.completed": {
			const session = event.data.object;
			const customerId =
				typeof session.customer === "string"
					? session.customer
					: session.customer?.id;
			const subscriptionId =
				typeof session.subscription === "string"
					? session.subscription
					: session.subscription?.id;

			if (customerId) {
				await db.user.update({
					where: { stripeCustomerId: customerId },
					data: {
						subscriptionStatus: "active",
						stripeSubscriptionId: subscriptionId ?? undefined,
					},
				});
			}
			break;
		}

		case "customer.subscription.updated": {
			const subscription = event.data.object;
			const customerId =
				typeof subscription.customer === "string"
					? subscription.customer
					: subscription.customer?.id;

			if (customerId) {
				const statusMap: Record<string, string> = {
					active: "active",
					past_due: "past_due",
					canceled: "canceled",
					unpaid: "past_due",
				};
				const mappedStatus = statusMap[subscription.status] ?? "free";

				await db.user.update({
					where: { stripeCustomerId: customerId },
					data: { subscriptionStatus: mappedStatus },
				});
			}
			break;
		}

		case "customer.subscription.deleted": {
			const subscription = event.data.object;
			const customerId =
				typeof subscription.customer === "string"
					? subscription.customer
					: subscription.customer?.id;

			if (customerId) {
				await db.user.update({
					where: { stripeCustomerId: customerId },
					data: {
						subscriptionStatus: "free",
						stripeSubscriptionId: null,
					},
				});
			}
			break;
		}
	}

	return NextResponse.json({ received: true });
}
