import { databases } from "@/lib/appwrite"
import { ID } from "appwrite"
import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
})

// Stripe webhook secret
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature") as string

    // Verify the webhook signature
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error) {
      console.error("Webhook signature verification failed:", error)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error handling webhook:", error)
    return NextResponse.json({ error: "Error handling webhook" }, { status: 500 })
  }
}

// Handle checkout.session.completed event
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    // Get the customer ID and subscription ID
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string

    if (!customerId || !subscriptionId) {
      throw new Error("Missing customer ID or subscription ID")
    }

    // Get the user ID from the client_reference_id
    const userId = session.client_reference_id

    if (!userId) {
      throw new Error("Missing user ID in client_reference_id")
    }

    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Update the user's subscription in your database
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,             // DB ID
      process.env.APPWRITE_SUBSCRIPTION_COLLECTION!, // collection ID
      ID.unique(),
      {
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: subscription.items.data[0].price.id,
        stripeStatus: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      }
    )

    // Send a welcome email
    // await sendSubscriptionEmail(userId, "welcome")
  } catch (error) {
    console.error("Error handling checkout.session.completed:", error)
    throw error
  }
}

// Handle invoice.paid event
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  try {
    // Get the customer ID and subscription ID
    const customerId = invoice.customer as string
    const subscriptionId = invoice.subscription as string

    if (!customerId || !subscriptionId) {
      throw new Error("Missing customer ID or subscription ID")
    }

    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Get the user from the customer ID
    // const user = await getUserByStripeCustomerId(customerId)

    // if (!user) {
    //   throw new Error("User not found for customer ID: " + customerId)
    // }

    // Update the user's subscription in your database
    // await updateUserSubscription(user.id, {
    //   stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    // })

    // Send a receipt email
    // await sendSubscriptionEmail(user.id, "receipt", {
    //   invoiceId: invoice.id,
    //   amount: formatAmount(invoice.total, invoice.currency),
    //   date: new Date(invoice.created * 1000).toLocaleDateString(),
    // })
  } catch (error) {
    console.error("Error handling invoice.paid:", error)
    throw error
  }
}

// Handle invoice.payment_failed event
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    // Get the customer ID
    const customerId = invoice.customer as string

    if (!customerId) {
      throw new Error("Missing customer ID")
    }

    // Get the user from the customer ID
    // const user = await getUserByStripeCustomerId(customerId)

    // if (!user) {
    //   throw new Error("User not found for customer ID: " + customerId)
    // }

    // Send a payment failed email
    // await sendSubscriptionEmail(user.id, "payment_failed", {
    //   invoiceId: invoice.id,
    //   amount: formatAmount(invoice.total, invoice.currency),
    //   date: new Date(invoice.created * 1000).toLocaleDateString(),
    // })
  } catch (error) {
    console.error("Error handling invoice.payment_failed:", error)
    throw error
  }
}

// Handle customer.subscription.updated event
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // Get the customer ID
    const customerId = subscription.customer as string

    if (!customerId) {
      throw new Error("Missing customer ID")
    }

    // Get the user from the customer ID
    // const user = await getUserByStripeCustomerId(customerId)

    // if (!user) {
    //   throw new Error("User not found for customer ID: " + customerId)
    // }

    // Update the user's subscription in your database
    // await updateUserSubscription(user.id, {
    //   stripePriceId: subscription.items.data[0].price.id,
    //   stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    //   status: subscription.status,
    // })

    // If the subscription was canceled but not yet expired
    if (subscription.cancel_at_period_end) {
      // Send a cancellation email
      // await sendSubscriptionEmail(user.id, "cancellation", {
      //   endDate: new Date(subscription.current_period_end * 1000).toLocaleDateString(),
      // })
    }
  } catch (error) {
    console.error("Error handling customer.subscription.updated:", error)
    throw error
  }
}

// Handle customer.subscription.deleted event
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    // Get the customer ID
    const customerId = subscription.customer as string

    if (!customerId) {
      throw new Error("Missing customer ID")
    }

    // Get the user from the customer ID
    // const user = await getUserByStripeCustomerId(customerId)

    // if (!user) {
    //   throw new Error("User not found for customer ID: " + customerId)
    // }

    // Update the user's subscription in your database
    // await updateUserSubscription(user.id, {
    //   stripePriceId: null,
    //   stripeSubscriptionId: null,
    //   stripeCurrentPeriodEnd: null,
    //   status: "inactive",
    // })

    // Send a subscription ended email
    // await sendSubscriptionEmail(user.id, "subscription_ended")
  } catch (error) {
    console.error("Error handling customer.subscription.deleted:", error)
    throw error
  }
}

// Helper function to format amount
function formatAmount(amount: number, currency: string) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  })

  return formatter.format(amount / 100)
}
