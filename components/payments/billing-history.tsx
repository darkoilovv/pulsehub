"use client"

import { useState, useEffect } from "react"
import { Download, FileText, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// Define invoice interface
interface Invoice {
  id: string
  number: string
  date: string
  amount: string
  status: "paid" | "pending" | "failed"
  description: string
  pdfUrl?: string
}

export function BillingHistory() {
  const { toast } = useToast()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all-time")
  const [isDownloading, setIsDownloading] = useState<string | null>(null)

  // Fetch invoices on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // In a real app, you would fetch invoices from your API
        // For now, we'll use mock data
        const mockInvoices: Invoice[] = [
          {
            id: "in_1234567890",
            number: "INV-001",
            date: "Apr 15, 2023",
            amount: "$49.00",
            status: "paid",
            description: "Pro Plan - Monthly",
            pdfUrl: "https://example.com/invoice-001.pdf",
          },
          {
            id: "in_0987654321",
            number: "INV-002",
            date: "Mar 15, 2023",
            amount: "$49.00",
            status: "paid",
            description: "Pro Plan - Monthly",
            pdfUrl: "https://example.com/invoice-002.pdf",
          },
          {
            id: "in_1122334455",
            number: "INV-003",
            date: "Mar 02, 2023",
            amount: "$25.00",
            status: "paid",
            description: "Email Credits - 10,000",
            pdfUrl: "https://example.com/invoice-003.pdf",
          },
          {
            id: "in_5566778899",
            number: "INV-004",
            date: "Feb 15, 2023",
            amount: "$49.00",
            status: "paid",
            description: "Pro Plan - Monthly",
            pdfUrl: "https://example.com/invoice-004.pdf",
          },
          {
            id: "in_9988776655",
            number: "INV-005",
            date: "Jan 15, 2023",
            amount: "$49.00",
            status: "paid",
            description: "Pro Plan - Monthly",
            pdfUrl: "https://example.com/invoice-005.pdf",
          },
        ]

        // In a real app, you would call your API:
        // const data = await getInvoices(dateFilter)
        setInvoices(mockInvoices)
      } catch (error) {
        console.error("Error fetching invoices:", error)
        toast({
          title: "Failed to load invoices",
          description: "Please try again later or contact support.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [dateFilter, toast])

  const handleDownloadInvoice = async (invoiceId: string) => {
    setIsDownloading(invoiceId)
    try {
      // In a real app, you would call your API to download the invoice
      // await downloadInvoice(invoiceId)

      // Simulate download delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Invoice downloaded",
        description: "Your invoice has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Error downloading invoice:", error)
      toast({
        title: "Download failed",
        description: "Unable to download invoice. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Failed
          </Badge>
        )
      default:
        return null
    }
  }

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>View and download your past invoices</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search invoices..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all-time" value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                <SelectItem value="year-to-date">Year to Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No invoices found</p>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        disabled={isDownloading === invoice.id}
                      >
                        {isDownloading === invoice.id ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        <span className="sr-only">Download</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex justify-center">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Need a custom invoice? Contact support
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
