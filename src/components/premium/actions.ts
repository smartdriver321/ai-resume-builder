'use server'

import stripe from '@/lib/stripe'
import baseUrl from '@/lib/utils'
import { currentUser } from '@clerk/nextjs/server'

export async function createCheckoutSession(priceId: string) {
	const user = await currentUser()

	if (!user) {
		throw new Error('Unauthorized')
	}

	const stripeCustomerId = user.privateMetadata.stripeCustomerId as
		| string
		| undefined

	const session = await stripe.checkout.sessions.create({
		line_items: [{ price: priceId, quantity: 1 }],
		mode: 'subscription',
		success_url: `${baseUrl}/billing/success`,
		cancel_url: `${baseUrl}/billing`,
		customer: stripeCustomerId,
		customer_email: stripeCustomerId
			? undefined
			: user.emailAddresses[0].emailAddress,
		metadata: {
			userId: user.id,
		},
		subscription_data: {
			metadata: {
				userId: user.id,
			},
		},
		custom_text: {
			terms_of_service_acceptance: {
				message: `I have read AI Resume Builder's [terms of service](${baseUrl}/tos) and agree to them.`,
			},
		},
		consent_collection: {
			terms_of_service: 'required',
		},
	})

	if (!session.url) {
		throw new Error('Failed to create checkout session')
	}

	return session.url
}