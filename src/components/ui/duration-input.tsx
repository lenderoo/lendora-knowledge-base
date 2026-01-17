import * as React from "react"
import { cn } from "@/lib/utils"

type DurationUnit = "year" | "month" | "week" | "day"

interface DurationInputProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  value: string | null | undefined
  onChange: (value: string) => void
  units: DurationUnit[]
  placeholder?: string
}

const UNIT_LABELS: Record<DurationUnit, string> = {
  year: "年",
  month: "月",
  week: "周",
  day: "天",
}

const UNIT_ORDER: DurationUnit[] = ["year", "month", "week", "day"]

interface ParsedDuration {
  year?: number
  month?: number
  week?: number
  day?: number
}

function parseDuration(value: string | null | undefined): ParsedDuration {
  if (!value) return {}

  const result: ParsedDuration = {}

  const yearMatch = value.match(/(\d+)\s*年/)
  const monthMatch = value.match(/(\d+)\s*(?:个)?月/)
  const weekMatch = value.match(/(\d+)\s*周/)
  const dayMatch = value.match(/(\d+)\s*(?:天|日)/)

  if (yearMatch) result.year = parseInt(yearMatch[1], 10)
  if (monthMatch) result.month = parseInt(monthMatch[1], 10)
  if (weekMatch) result.week = parseInt(weekMatch[1], 10)
  if (dayMatch) result.day = parseInt(dayMatch[1], 10)

  return result
}

function formatDuration(parsed: ParsedDuration, units: DurationUnit[]): string {
  const parts: string[] = []

  for (const unit of UNIT_ORDER) {
    if (units.includes(unit) && parsed[unit]) {
      parts.push(`${parsed[unit]}${UNIT_LABELS[unit]}`)
    }
  }

  return parts.join("")
}

function DurationInput({
  className,
  value,
  onChange,
  units,
  placeholder,
  ...props
}: DurationInputProps) {
  const parsed = parseDuration(value)

  const handleUnitChange = (unit: DurationUnit, inputValue: string) => {
    const numValue = inputValue === "" ? undefined : parseInt(inputValue, 10)

    if (inputValue !== "" && isNaN(numValue!)) return

    const newParsed: ParsedDuration = { ...parsed }
    if (numValue === undefined || numValue === 0) {
      delete newParsed[unit]
    } else {
      newParsed[unit] = numValue
    }

    onChange(formatDuration(newParsed, units))
  }

  const inputClassName = cn(
    "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-16 min-w-0 rounded-md border bg-transparent px-2 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-center",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
  )

  return (
    <div className={cn("flex items-center gap-1", className)} {...props}>
      {units.map((unit) => (
        <React.Fragment key={unit}>
          <input
            type="text"
            inputMode="numeric"
            className={inputClassName}
            value={parsed[unit] || ""}
            onChange={(e) => handleUnitChange(unit, e.target.value)}
            placeholder="0"
          />
          <span className="text-sm text-muted-foreground">{UNIT_LABELS[unit]}</span>
        </React.Fragment>
      ))}
    </div>
  )
}

export { DurationInput }
export type { DurationUnit }
