"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ITransaction, TransactionCategory } from "@/app/types/ITransaction"
import { User } from "@/app/types/user"

interface TransactionTableProps {
  transactions: ITransaction[]
  showUserFilter: boolean
}

export default function TransactionTable({ transactions, showUserFilter }: TransactionTableProps) {
  const [dateFilter, setDateFilter] = useState("")
  const [userFilter, setUserFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredTransactions = transactions.filter((transaction) => {
    const dateMatches = dateFilter ? format(new Date(transaction.createdAt), "yyyy-MM-dd") === dateFilter : true
    const userMatches = userFilter ? (transaction.user as User).username.includes(userFilter) : true
    const categoryMatches = categoryFilter ? transaction.category === categoryFilter : true
    return dateMatches && userMatches && categoryMatches
  })

  const pageCount = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-auto" />
        {showUserFilter && (
          <Input
            type="text"
            placeholder="Filter by user"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          />
        )}
        <Select onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.values(TransactionCategory).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            setDateFilter("")
            setUserFilter("")
            setCategoryFilter("")
          }}
        >
          Clear Filters
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            {showUserFilter && <TableHead>User</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTransactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell>{format(new Date(transaction.createdAt), "yyyy-MM-dd")}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>${transaction.amount.toFixed(2)}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              {showUserFilter && <TableCell>{(transaction.user as User).username}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
          </PaginationItem>
          {[...Array(pageCount)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

