"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import saveAs from "file-saver"
import { DatePickerWithRange } from "../DatePickerWithRange"
import { ITransaction, TransactionType } from "@/app/types/ITransaction"

interface ReportGeneratorProps {
  transactions: ITransaction[]
}

export default function ReportGenerator({ transactions }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<"all" | "income" | "expense">("all")


  const generateReport = () => {
    let filteredTransactions = transactions
    if (reportType === "income") {
      filteredTransactions = filteredTransactions.filter((t) => t.type === TransactionType.DEPOSIT)
    } else if (reportType === "expense") {
      filteredTransactions = filteredTransactions.filter((t) => t.type === TransactionType.WITHDRAWAL)
    }

    return filteredTransactions
  }

  const exportCSV = () => {
    const report = generateReport()
    const csv = report
      .map((t) => [format(new Date(t.createdAt), "yyyy-MM-dd"), t.type, t.amount, t.category, t.description].join(","))
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, "financial_report.csv")
  }

  const exportExcel = () => {
    const report = generateReport()
    const ws = XLSX.utils.json_to_sheet(report)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Report")
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    saveAs(data, "financial_report.xlsx")
  }

  const exportPDF = () => {
    const report = generateReport()
    console.log(report)
    
    const doc = new jsPDF()
    doc.text("Financial Report", 14, 15)
    //@ts-ignore
    doc.autoTable({
      head: [["Date", "Type", "Amount", "Category", "Description"]],
      body: report.map((t) => [
        format(new Date(t.createdAt), "yyyy-MM-dd"),
        t.type,
        t.amount,
        t.category,
        t.description,
      ]),
    })
    doc.save("financial_report.pdf")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Select onValueChange={(value) => setReportType(value as "all" | "income" | "expense")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="income">Income Only</SelectItem>
            <SelectItem value="expense">Expenses Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-4">
        <Button onClick={exportCSV}>Export CSV</Button>
        <Button onClick={exportExcel}>Export Excel</Button>
        <Button onClick={exportPDF}>Export PDF</Button>
      </div>
    </div>
  )
}

