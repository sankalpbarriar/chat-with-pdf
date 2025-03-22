//we are supporting a POST requst
import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "../../../firebaseAdmin";

export async function POST(req: NextRequest) {
  const headerList = headers();
  //get body of the text
  const body = await req.text(); //this include event details etc..
  const signature = (await headerList).get("stripe-signature");

  if (!signature) {
    return new Response("No Response", { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("Stripe webhook secret is not set");
    return new Response("Stripe webhhok secret is not set", {
      status: 400,
    });
  }

  let event: Stripe.Event;
  //when stripe pings the webhook it hits its end pooint we basically mixing the text and signature together and stripe will say it is real or fake
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook Error : ${err}`);
    return new NextResponse(`Webhook Error : ${err},{status : 400}`);
  }

  const getUserDetails = async (customerId: string) => {
    const userDoc = await adminDb
      .collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();

    if (!userDoc.empty) {
      return userDoc.docs[0];
    }
  };
  console.log("Fetching the events from Stripe...");
  switch (event.type) {
    case "checkout.session.completed":
    case "payment_intent.succeeded": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;

      const userDetails = await getUserDetails(customerId);
      if (!userDetails?.id) {
        return new NextResponse("User not found", { status: 404 });
      }

      // Update the user's subscription status
      await adminDb.collection("users").doc(userDetails?.id).update({
        hasActiveMembership: true,
      });

      break;
    }
    case "customer.subscription.deleted":
    case "subscription_schedule.canceled": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const userDetails = await getUserDetails(customerId);
      if (!userDetails?.id) {
        return new NextResponse("User not found", { status: 404 });
      }

      await adminDb.collection("users").doc(userDetails?.id).update({
        hasActiveMembership: false,
      });
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ message: "Webhook Resieved" });
}
