'use client'
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { CheckIcon } from "lucide-react"
import useSubscription from "../../../../hooks/useSubsription";
import { useTransition } from "react";
import getStripe from "@/lib/stripe-js";
import { createCheckoutSession } from "../../../../actions/createCheckoutSession";
import { createStripePortal } from "../../../../actions/createStripePortal";
import { useRouter } from "next/navigation";

export type UserDetails = {
    email: string;
    name: string;
}

function PricingPage() {
    const { user } = useUser();
    const router = useRouter();
    //pull in user subscription
    const {hasActiveMembership, loading} = useSubscription();  //extracted from the custom hook
    const [isPending, startTransition] = useTransition();   //isPending is true while async fxn is loading

    console.log(hasActiveMembership)


    //when we will click on the upgrade to pro we will create a checkout session and give the stripe two things email and fullname so it will prefill the name and email
    const handleUpgrade = () => {
        if (!user) return;

        const userDetails: UserDetails = {
            email: user.primaryEmailAddress?.toString() ?? "",
            name: user.fullName ?? "user",
        };

        startTransition(async()=>{
            //load stripe
            const stripe = await getStripe();
            
            if(hasActiveMembership){
                //create stripe portal..
                //once you are already subsribed we dont need to create a checkout session instead we shall allow user to cutomize their memebership using stripe protal
                const stripePortalUrl = await createStripePortal();
                return router.push(stripePortalUrl as string);
            }

            const sessionId = await createCheckoutSession(userDetails);
            await stripe?.redirectToCheckout({
                sessionId,
            })
        })
    };


    return (
        <div>
            <div className="py-24 lg:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">Pricing</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tighter text-gray-900 sm:text-5xl">Supercharge your Document Companion</p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl px-10 text-center text-lg leading-8 text-gray-600">
                    Choose an affordable plan thats packed with  the best features
                    for interacting with your PDFs, enhancing productivity, and
                    your workflow.
                </p>
                <div className="max-w-md mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 md:max-w-2xl gap-8 lg:max-w-4xl">
                    {/* free plan */}
                    <div className="ring-1 ring-gray-300 p-8 h-fit pb-12 rounded-3xl">
                        <h3 className="text-lg font-semibold leading-8 text-gray-900">
                            Starter plan
                        </h3>
                        <p className="mt-4 text-sm leading-6 text-gray-600">
                            Explore core features at No Cost
                        </p>
                        <p className="mt-6 flex items-baseline gap-x-1">
                            <span className="text-4xl font-bold tracking-tight text-gray-900">
                                Free
                            </span>
                        </p>

                        <ul
                            role="list"
                            className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                        >
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />2
                                Documents
                            </li>
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                                Up to 3 messages per document
                            </li>
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                                Try out the AI Chat Functionality
                            </li>
                        </ul>
                    </div>
                    {/* paid plan */}
                    <div className="ring-2 ring-blue-600  rounded-3xl p-8">
                        <h3 className="text-lg font-semibold leading-8 text-gray-900">
                            Pro plan
                        </h3>
                        <p className="mt-4 text-sm leading-6 text-gray-600">
                            Maximize Productivity with PRO features
                        </p>
                        <p className=" mt-6 flex items-baseline gap-x-1">
                            <span className="text-4xl font-bold tracking-tight text-gray-900">
                                ₹299
                            </span>
                            <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                        </p>
                        <Button
                            className="bg-blue-600 w-full text-white shadow-lg hover:bg-blue-500 mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            disabled={loading || isPending}
                            onClick={handleUpgrade}
                        >
                            {isPending || loading
                                ? "Loading..."
                                : hasActiveMembership
                                    ? "Manaage Plan"
                                    : "Upgrade to Pro"
                            }
                        </Button>
                        <ul
                            role="list"
                            className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                        >
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                                Store upto 20 Documents
                            </li>
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                                Ability to Delete Documents
                            </li>
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                                Up to 100 messages per document
                            </li>
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                                Full Power AI Chat Functionality with Memory Recall
                            </li>
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                                Advanced analytics
                            </li>
                            <li className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-blue-600" />
                                24-hour support response time
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PricingPage