"use server";

import { requireAuth } from "#lib/auth";
import { db } from "#lib/db";
import { getStripeClient } from "#lib/stripe";

export async function createCheckoutSessionAction(): Promise<{
	url: string | null;
}> {
	const { userId } = await requireAuth();

	const user = await db.user.findUniqueOrThrow({
		where: { id: userId },
		select: { email: true, stripeCustomerId: true },
	});

	const stripe = getStripeClient();

	let customerId = user.stripeCustomerId;

	if (!customerId) {
		const customer = await stripe.customers.create({
			email: user.email,
			metadata: { userId },
		});
		customerId = customer.id;
		await db.user.update({
			where: { id: userId },
			data: { stripeCustomerId: customerId },
		});
	}

	const session = await stripe.checkout.sessions.create({
		customer: customerId,
		mode: "subscription",
		line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
		success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/account?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/account`,
	});

	return { url: session.url };
}

export async function createPortalSessionAction(): Promise<{
	url: string | null;
}> {
	const { userId } = await requireAuth();

	const user = await db.user.findUniqueOrThrow({
		where: { id: userId },
		select: { stripeCustomerId: true },
	});

	if (!user.stripeCustomerId) {
		return { url: null };
	}

	const stripe = getStripeClient();

	const session = await stripe.billingPortal.sessions.create({
		customer: user.stripeCustomerId,
		return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/account`,
	});

	return { url: session.url };
}
