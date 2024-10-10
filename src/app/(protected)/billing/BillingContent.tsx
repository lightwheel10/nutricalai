'use client';

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const BillingContent: React.FC = () => {
  // Mock data - replace with actual user data
  const currentPlan = {
    name: "Pro",
    price: "$19.99",
    nextBillingDate: "2023-07-01",
  }

  const invoices = [
    { id: 1, date: "2023-06-01", amount: "$19.99", status: "Paid" },
    { id: 2, date: "2023-05-01", amount: "$19.99", status: "Paid" },
    { id: 3, date: "2023-04-01", amount: "$19.99", status: "Paid" },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-2">{currentPlan.name}</p>
            <p className="mb-2">Price: {currentPlan.price}/month</p>
            <p>Next billing date: {currentPlan.nextBillingDate}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="mr-2">Change Plan</Button>
            <Button variant="destructive">Cancel Plan</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BillingContent
