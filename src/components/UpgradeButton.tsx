'use client'

import useSubscription from "../../hooks/useSubsription"
import { Button } from "./ui/button"
import Link from "next/link"
import { createStripePortal } from "../../actions/createStripePortal"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Loader2Icon, StarsIcon } from "lucide-react"

const UpgradeButton = () => {
    const { hasActiveMembership, loading } = useSubscription();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleAccount = () => {
        startTransition(async () => {
            const stripePortalUrl = await createStripePortal();
            router.push(stripePortalUrl as string);
        })
    }

    //if the user has no active memenr ship or not loading show him the upgrade button
    if (!hasActiveMembership && !loading)
        return (
            <Button asChild variant="default" className="border-blue-600">
                <Link href="/dashboard/upgrade">
                    Upgrade <StarsIcon className="ml-2 fill-blue-600 text-white" /></Link>
            </Button>
        )
    if (loading)
        return (
            <Button variant="default" className="border-blue-600">
                <Loader2Icon className="animate-spin" />
            </Button>
        )

    return (
        <Button
            onClick={handleAccount}
            disabled={isPending}
            variant="default"
            className="border-blue-600 bg-blue-600"
        >
            {isPending ? (
                <Loader2Icon className="animate-spin" />
            ) : (
                <p>
                    <span className="font-extrabold">PRO </span>
                    Account
                </p>
            )}
        </Button>
    )
}

export default UpgradeButton