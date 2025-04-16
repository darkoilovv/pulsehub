"use client"

import { useState } from "react"
import { Check, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { createCheckoutSession } from "@/lib/stripe/actions"
import { useToast } from "@/components/ui/use-toast"
import { account } from "@/lib/appwrite"

// Define subscription plan types
export type PlanType = "free" | "starter" | "pro" | "business"

// Define subscription plan interface
interface Plan {
  id: PlanType
  name: string
  price: string
  priceId: string // Stripe price ID
  period: "month" | "year"
  features: string[]
  popular: boolean
}

export function SubscriptionPlan() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<PlanType | null>(null)

  // Mock data for current subscription - in a real app, this would come from your database
  const currentPlan = {
    name: "Pro",
    price: "$49",
    period: "month",
    emailsRemaining: 8500,
    emailsTotal: 15000,
    smsRemaining: 950,
    smsTotal: 1000,
    renewalDate: "May 15, 2023",
  }

  // Plans with Stripe price IDs - in a real app, these would be fetched from your database
  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      priceId: "", // No price ID for free plan
      period: "month",
      features: ["1,000 emails per month", "100 SMS messages", "1 instance", "Basic analytics"],
      popular: false,
    },
    {
      id: "starter",
      name: "Starter",
      price: "$19",
      priceId: "price_1234567890starter", // Replace with actual Stripe price ID
      period: "month",
      features: ["5,000 emails per month", "500 SMS messages", "2 instances", "Basic analytics", "Email support"],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$49",
      priceId: `${process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRO_PRICE_ID}`, // Replace with actual Stripe price ID
      period: "month",
      features: [
        "15,000 emails per month",
        "1,000 SMS messages",
        "5 instances",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
      ],
      popular: true,
    },
    {
      id: "business",
      name: "Business",
      price: "$99",
      priceId: "price_1234567890business", // Replace with actual Stripe price ID
      period: "month",
      features: [
        "50,000 emails per month",
        "5,000 SMS messages",
        "Unlimited instances",
        "Advanced analytics",
        "24/7 phone support",
        "Custom branding",
        "Dedicated account manager",
      ],
      popular: false,
    },
  ]

  // Handle subscription checkout with Stripe
  const handleSubscribe = async (plan: Plan) => {
    if (plan.id === "free") {
      toast({
        title: "Free plan selected",
        description: "Your account has been updated to the free plan.",
      })
      return
    }

    try {
      setIsLoading(plan.id)

      const userId = await account.get().then(res => res.$id) 

      // Create a checkout session with Stripe
      const { url } = await createCheckoutSession({
        priceId: plan.priceId,
        successUrl: `${window.location.origin}/payments?success=true`,
        cancelUrl: `${window.location.origin}/payments?canceled=true`,
        userId: userId,
      })

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast({
        title: "Something went wrong",
        description: "Please try again later or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your subscription details and usage</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">{currentPlan.name} Plan</h3>
              <p className="text-muted-foreground">
                {currentPlan.price}/{currentPlan.period}
              </p>
            </div>
            <Badge variant="outline" className="w-fit">
              Active
            </Badge>
          </div>

          <div className="grid gap-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Email Usage</span>
                <span className="text-sm text-muted-foreground">
                  {currentPlan.emailsRemaining.toLocaleString()} of {currentPlan.emailsTotal.toLocaleString()} remaining
                </span>
              </div>
              <Progress value={(currentPlan.emailsRemaining / currentPlan.emailsTotal) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">SMS Usage</span>
                <span className="text-sm text-muted-foreground">
                  {currentPlan.smsRemaining} of {currentPlan.smsTotal} remaining
                </span>
              </div>
              <Progress value={(currentPlan.smsRemaining / currentPlan.smsTotal) * 100} className="h-2" />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Your subscription will renew on{" "}
            <span className="font-medium text-foreground">{currentPlan.renewalDate}</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between">
          <Button variant="outline" className="w-full sm:w-auto">
            Cancel Subscription
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose the plan that best fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="relative border rounded-lg p-4 h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-medium">{plan.name}</div>
                  {plan.popular && (
                    <Badge className="bg-primary hover:bg-primary">
                      <Zap className="mr-1 h-3 w-3" /> Popular
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <ul className="grid gap-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Button
                    className="w-full"
                    variant={plan.id === "pro" ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan)}
                    disabled={isLoading !== null}
                  >
                    {isLoading === plan.id ? (
                      <span className="flex items-center gap-1">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </span>
                    ) : (
                      <>{plan.id === "free" ? "Get Started" : "Subscribe"}</>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need More?</CardTitle>
          <CardDescription>Purchase additional credits for your current plan</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Email Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span>5,000 emails</span>
                    <span className="font-medium">$15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>10,000 emails</span>
                    <span className="font-medium">$25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>25,000 emails</span>
                    <span className="font-medium">$50</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Buy Email Credits
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">SMS Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span>500 SMS</span>
                    <span className="font-medium">$20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1,000 SMS</span>
                    <span className="font-medium">$35</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2,500 SMS</span>
                    <span className="font-medium">$75</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Buy SMS Credits
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
