"use server";

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../firebaseAdmin";
import stripe from "@/lib/stripe";
import getBaseUrl from "@/lib/getBaseUrl";

export async function createStripePortal() {
  auth.protect();

  const { userId } = await auth();

  if (!userId) {
    return new Error("user not found");
  }

  //get customer Id from firebase
  const user = await adminDb.collection("users").doc(userId).get();
  const stripeCustomerId = user.data()?.stripeCustomerId;

  if (!stripeCustomerId) {
    throw new Error("stripe customer not found");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${getBaseUrl()}/dashboard`,
  });
  return session.url;
}
