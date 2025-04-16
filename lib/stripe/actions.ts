"use server"

import Stripe from "stripe"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
})

// Create a checkout session for subscription
export async function createCheckoutSession({
  priceId,
  successUrl,
  cancelUrl,
  userId
}: {
  priceId: string
  successUrl: string
  cancelUrl: string
  userId: string
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
    })

    return { url: session.url }
  } catch (error: any) {
    console.error("Stripe Error Details:", error)
    throw new Error(error?.message || "Failed to create checkout session")
  }
}

// Create a payment method
export async function createPaymentMethod(paymentMethodId: string) {
  try {
    // Get the user from the session
    // const user = await getCurrentUser()

    // if (!user) {
    //   throw new Error("User not found")
    // }

    // Get or create a Stripe customer
    // let customerId = user.stripeCustomerId

    // if (!customerId) {
    //   const customer = await stripe.customers.create({
    //     email: user.email,
    //     name: user.name,
    //   })
    //   customerId = customer.id

    //   // Save the customer ID to the user record
    //   await updateUserStripeCustomerId(user.id, customerId)
    // }

    // Attach the payment method to the customer
    // await stripe.paymentMethods.attach(paymentMethodId, {
    //   customer: customerId,
    // })

    // Set as default payment method if it's the first one
    // const paymentMethods = await stripe.paymentMethods.list({
    //   customer: customerId,
    //   type: "card",
    // })

    // if (paymentMethods.data.length === 1) {
    //   await stripe.customers.update(customerId, {
    //     invoice_settings: {
    //       default_payment_method: paymentMethodId,
    //     },
    //   })
    // }

    return { success: true }
  } catch (error) {
    console.error("Error creating payment method:", error)
    throw new Error("Failed to create payment method")
  }
}

// Delete a payment method
export async function deletePaymentMethod(paymentMethodId: string) {
  try {
    // Get the user from the session
    // const user = await getCurrentUser()

    // if (!user || !user.stripeCustomerId) {
    //   throw new Error("User not found or not a Stripe customer")
    // }

    // Detach the payment method from the customer
    // await stripe.paymentMethods.detach(paymentMethodId)

    return { success: true }
  } catch (error) {
    console.error("Error deleting payment method:", error)
    throw new Error("Failed to delete payment method")
  }
}

// Set default payment method
export async function setDefaultPaymentMethod(paymentMethodId: string) {
  try {
    // Get the user from the session
    // const user = await getCurrentUser()

    // if (!user || !user.stripeCustomerId) {
    //   throw new Error("User not found or not a Stripe customer")
    // }

    // Set as default payment method
    // await stripe.customers.update(user.stripeCustomerId, {
    //   invoice_settings: {
    //     default_payment_method: paymentMethodId,
    //   },
    // })

    return { success: true }
  } catch (error) {
    console.error("Error setting default payment method:", error)
    throw new Error("Failed to set default payment method")
  }
}

// Get invoices
export async function getInvoices(dateFilter = "all-time") {
  try {
    // Get the user from the session
    // const user = await getCurrentUser()

    // if (!user || !user.stripeCustomerId) {
    //   throw new Error("User not found or not a Stripe customer")
    // }

    // Set date filter
    // let created: { gte?: number } = {}
    // const now = Math.floor(Date.now() / 1000)

    // switch (dateFilter) {
    //   case "last-30-days":
    //     created.gte = now - 30 * 24 * 60 * 60
    //     break
    //   case "last-90-days":
    //     created.gte = now - 90 * 24 * 60 * 60
    //     break
    //   case "year-to-date":
    //     const startOfYear = new Date(new Date().getFullYear(), 0, 1)
    //     created.gte = Math.floor(startOfYear.getTime() / 1000)
    //     break
    // }

    // Get invoices from Stripe
    // const invoices = await stripe.invoices.list({
    //   customer: user.stripeCustomerId,
    //   limit: 100,
    //   created,
    // })

    // Format invoices
    // const formattedInvoices = invoices.data.map((invoice) => ({
    //   id: invoice.id,
    //   number: invoice.number || invoice.id,
    //   date: new Date(invoice.created * 1000).toLocaleDateString(),
    //   amount: formatAmount(invoice.total, invoice.currency),
    //   status: invoice.status,
    //   description: invoice.description || "Subscription payment",
    //   pdfUrl: invoice.invoice_pdf,
    // }))

    // return formattedInvoices
    return []
  } catch (error) {
    console.error("Error getting invoices:", error)
    throw new Error("Failed to get invoices")
  }
}

// Download invoice
export async function downloadInvoice(invoiceId: string) {
  try {
    // Get the user from the session
    // const user = await getCurrentUser()

    // if (!user) {
    //   throw new Error("User not found")
    // }

    // Get invoice from Stripe
    // const invoice = await stripe.invoices.retrieve(invoiceId)

    // if (!invoice.invoice_pdf) {
    //   throw new Error("Invoice PDF not available")
    // }

    // return { url: invoice.invoice_pdf }
    return { url: "" }
  } catch (error) {
    console.error("Error downloading invoice:", error)
    throw new Error("Failed to download invoice")
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
