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
  const [userFilter, setUserFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredTransactions = transactions.filter((transaction) => {
    const userMatches = userFilter ? (transaction.user as User).username.includes(userFilter) : true
    const categoryMatches = (categoryFilter !== "all" && categoryFilter !== "") ? transaction.category === categoryFilter : true
    return userMatches && categoryMatches
  })

  const pageCount = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {showUserFilter && (
          <Input
            type="text"
            placeholder="Filtrar por usuario"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          />
        )}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {Object.values(TransactionCategory).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            setUserFilter("")
            setCategoryFilter("")
          }}
        >
          Limpiar filtros
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Categoría</TableHead>
            {showUserFilter && <TableHead>Usuario</TableHead>}
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

