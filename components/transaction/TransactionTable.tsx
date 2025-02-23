'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ITransaction, TransactionCategory, TransactionType } from '@/app/types/ITransaction';
import { User } from '@/app/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ISponsor } from '@/app/types/sponsor';

interface TransactionTableProps {
  transactions: ITransaction[];
  showUserFilter: boolean;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const TruncatedText = ({ text, maxLength }: { text: string; maxLength: number }) => {
  const truncated = truncateText(text, maxLength);
  if (truncated === text) return <span>{text}</span>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{truncated.toLowerCase()}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-64 text-center break-words">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function TransactionTable({ transactions, showUserFilter }: TransactionTableProps) {
  const [userFilter, setUserFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTransactions = transactions.filter((transaction) => {
    const userMatches = userFilter ? (transaction.user as User).username.includes(userFilter) : true;
    const categoryMatches =
      categoryFilter !== 'all' && categoryFilter !== '' ? transaction.category === categoryFilter : true;
    return userMatches && categoryMatches;
  });

  const pageCount = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            setUserFilter('');
            setCategoryFilter('');
          }}
        >
          Limpiar filtros
        </Button>
      </div>
      {/* Table view for desktop */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              {showUserFilter && <TableHead>Usuario</TableHead>}
              <TableHead>Patrocinador</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{format(new Date(transaction.createdAt), 'yyyy-MM-dd')}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <TruncatedText text={transaction.description} maxLength={30} />
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                {showUserFilter && <TableCell>{(transaction.user as User).username}</TableCell>}
                <TableCell>
                  <TruncatedText text={(transaction.sponsor as ISponsor)?.name ?? ''} maxLength={30} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card view for mobile */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {paginatedTransactions.map((transaction) => (
          <Card key={transaction._id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {format(new Date(transaction.createdAt), 'yyyy-MM-dd')}
                </CardTitle>
                <Badge variant={transaction.type === TransactionType.DEPOSIT ? 'default' : 'destructive'}>
                  {transaction.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="grid gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monto:</span>
                  <span
                    className={`font-bold ${
                      transaction.type === TransactionType.DEPOSIT ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ${transaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Categoría:</span>
                  <span className="text-sm">{transaction.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Descripción:</span>
                  <span className="text-sm">
                    <TruncatedText text={transaction.description} maxLength={20} />
                  </span>
                </div>
                {showUserFilter && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Usuario:</span>
                    <span className="text-sm">{(transaction.user as User).username}</span>
                  </div>
                )}
                {transaction.sponsor && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Patrocinador:</span>
                    <span className="text-sm">
                      <TruncatedText text={(transaction.sponsor as ISponsor)?.name ?? ''} maxLength={20} />
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
  );
}
