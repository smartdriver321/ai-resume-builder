'use client'

import { useState } from 'react'

import { useToast } from '@/hooks/use-toast'
import { createCustomerPortalSession } from './actions'
import LoadingButton from '@/components/LoadingButton'

export default function ManageSubscriptionButton() {
	const { toast } = useToast()

	const [loading, setLoading] = useState(false)

	async function handleClick() {
		try {
			setLoading(true)
			const redirectUrl = await createCustomerPortalSession()
			window.location.href = redirectUrl
		} catch (error) {
			console.error(error)
			toast({
				variant: 'destructive',
				description: 'Something went wrong. Please try again.',
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<LoadingButton onClick={handleClick} loading={loading}>
			Manage subscription
		</LoadingButton>
	)
}
