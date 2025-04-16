"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CreditCard, PlusCircle, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { CardElement } from "@stripe/react-stripe-js"
import { createPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod } from "@/lib/stripe/actions"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Define payment method interface
interface PaymentMethod {
  id: string
  type: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

export function PaymentMethods() {
  const { toast } = useToast()
  const [isAddCardOpen, setIsAddCardOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])

  // Fetch payment methods on component mount
  useEffect(() => {
    // In a real app, you would fetch payment methods from your API
    // For now, we'll use mock data
    setPaymentMethods([
      {
        id: "pm_1234567890",
        type: "card",
        brand: "visa",
        last4: "4242",
        expMonth: 12,
        expYear: 2024,
        isDefault: true,
      },
      {
        id: "pm_0987654321",
        type: "card",
        brand: "mastercard",
        last4: "5555",
        expMonth: 8,
        expYear: 2025,
        isDefault: false,
      },
    ])
  }, [])

  const handleDeleteCard = (cardId: string) => {
    setSelectedCard(cardId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteCard = async () => {
    if (!selectedCard) return

    setIsLoading(true)
    try {
      // Delete payment method via Stripe
      await deletePaymentMethod(selectedCard)

      // Update local state
      setPaymentMethods(paymentMethods.filter((method) => method.id !== selectedCard))

      toast({
        title: "Payment method removed",
        description: "Your payment method has been successfully removed.",
      })
    } catch (error) {
      console.error("Error removing payment method:", error)
      toast({
        title: "Something went wrong",
        description: "Unable to remove payment method. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
      setSelectedCard(null)
    }
  }

  const handleSetDefaultCard = async (cardId: string) => {
    setIsLoading(true)
    try {
      // Set default payment method via Stripe
      await setDefaultPaymentMethod(cardId)

      // Update local state
      setPaymentMethods(
        paymentMethods.map((method) => ({
          ...method,
          isDefault: method.id === cardId,
        })),
      )

      toast({
        title: "Default payment method updated",
        description: "Your default payment method has been updated successfully.",
      })
    } catch (error) {
      console.error("Error setting default payment method:", error)
      toast({
        title: "Something went wrong",
        description: "Unable to update default payment method. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCard = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const stripe = await stripePromise
      const elements = stripe?.elements()

      if (!stripe || !elements) {
        throw new Error("Stripe.js hasn't loaded yet")
      }

      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        throw new Error("Card element not found")
      }

      // Create payment method via Stripe
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!paymentMethod) {
        throw new Error("Failed to create payment method")
      }

      // Save payment method to your backend
      await createPaymentMethod(paymentMethod.id)

      // Add to local state
      const newPaymentMethod: PaymentMethod = {
        id: paymentMethod.id,
        type: "card",
        brand: paymentMethod.card?.brand || "unknown",
        last4: paymentMethod.card?.last4 || "0000",
        expMonth: paymentMethod.card?.exp_month || 0,
        expYear: paymentMethod.card?.exp_year || 0,
        isDefault: paymentMethods.length === 0, // Make default if it's the first card
      }

      setPaymentMethods([...paymentMethods, newPaymentMethod])

      toast({
        title: "Payment method added",
        description: "Your payment method has been added successfully.",
      })

      setIsAddCardOpen(false)
    } catch (error) {
      console.error("Error adding payment method:", error)
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Unable to add payment method. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getCardIcon = (brand: string) => {
    // In a real implementation, you would use actual card brand icons
    return <CreditCard className="h-5 w-5" />
  }

  const getCardBrandName = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1)
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods for billing</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No payment methods found</p>
              <p className="text-sm text-muted-foreground mt-1">Add a payment method to manage your subscription</p>
            </div>
          ) : (
            paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-md p-2">{getCardIcon(method.brand)}</div>
                  <div>
                    <div className="font-medium">
                      {getCardBrandName(method.brand)} •••• {method.last4}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expires {method.expMonth}/{method.expYear}
                    </div>
                  </div>
                  {method.isDefault && (
                    <Badge variant="outline" className="ml-2">
                      Default
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefaultCard(method.id)}
                      disabled={isLoading}
                    >
                      Set as default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCard(method.id)}
                    disabled={isLoading || method.isDefault}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
        <CardFooter>
          <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>Add a new credit or debit card for your subscription payments.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCard}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="card-element">Card Details</Label>
                    <div className="p-3 border rounded-md">
                      <Elements stripe={stripePromise}>
                        <CardElement
                          options={{
                            style: {
                              base: {
                                fontSize: "16px",
                                color: "#424770",
                                "::placeholder": {
                                  color: "#aab7c4",
                                },
                              },
                              invalid: {
                                color: "#9e2146",
                              },
                            },
                          }}
                        />
                      </Elements>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsAddCardOpen(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-1">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </span>
                    ) : (
                      "Add Card"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this payment method? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCard} disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </span>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
