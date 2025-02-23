"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Calendar } from "./Calendar"
import { cn } from "@/app/lib/utils"

interface DatePickerWithRangeProps {
  onDateRangeChange: (date: { from: Date; to: Date } | undefined) => void
}

export function DatePickerWithRange({ onDateRangeChange }: DatePickerWithRangeProps) {
  const [date, setDate] = useState<{ from: Date; to: Date } | undefined>(undefined)

  // const [date, setDate] = useState<{ from: Date; to: Date } | undefined>(
  //   {
  //     from: new Date(new Date().setDate(new Date().getDate() - 30)),
  //     to: new Date(),
  //   }
  // )

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            {date?.from ? (
              date.to ? (
                `${format(date.from, "MMM dd, yyyy")} - ${format(date.to, "MMM dd, yyyy")}`
              ) : (
                format(date.from, "MMM dd, yyyy")
              )
            ) : (
              <span>Selecciona un rango de fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(date) => {
              setDate(date as { from: Date; to: Date })
              onDateRangeChange(date as { from: Date; to: Date })
            }}
            numberOfMonths={2}
            pagedNavigation
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

